import UserRepository from "../../DB/Repositories/user.repository.js";
import envConfig from "../../Config/env.config.js";
import { BadRequestException, ConflictException } from "../../Common/Utils/Errors/exception.error.js";
import { encrypt } from "../../Common/Utils/Security/encryption.security.js";
import { hashing, verifying } from "../../Common/Utils/Security/hash.security.js";
import { decodeToken, generateToken } from "../../Common/Utils/token.utils.js";
import { providersEnum, tokenTypeEnum } from "../../Common/constants.js";
import { OAuth2Client } from "google-auth-library";
import { calculateTTL, del, get, set } from "../../Common/Services/redis.service.js";
import { handlingOTP } from "../../Common/Utils/otp.utils.js";

// Repo
const userRepo = new UserRepository();

// Build Tokens (Access & Refresh) based on role
const buildTokens = (user) => {
    const tokenPayload = { id: user._id, email: user.email, role: user.role };
    const role = user.role;
    const accessToken = generateToken(tokenPayload, role, tokenTypeEnum.ACCESS_TOKEN);
    const refreshToken = generateToken(tokenPayload, role, tokenTypeEnum.REFRESH_TOKEN);

    return { accessToken, refreshToken };
}

// Register User Service
export const registerUserService = async (body) => {
    const { firstName, lastName, email, password, gender, age, phoneNumber } = body;
    const isEmailExists = await userRepo.findUserByEmail(email);
    if (isEmailExists) throw new ConflictException('Email already exists', { duplicatedEmail: email }, 'DUPLICATED_EMAIL');
    // Encrypt phone number before saving to the database
    let encryptedPhoneNumber;
    if (phoneNumber) encryptedPhoneNumber = encrypt(phoneNumber)
    // Hashing password before saving to the database
    const hashedPassword = await hashing(password);

    // Handle OTP: Creating OTP, hashing it and storing it in redis
    await handlingOTP(email, firstName);

    const user = await userRepo.createDocument({ firstName, lastName, email, password: hashedPassword, gender, age, phoneNumber: encryptedPhoneNumber || undefined });
    return user;
}

// Login User Service
export const loginUserService = async (body) => {
    const { email, password } = body;
    const user = await userRepo.findOneDocument({ email, provider: providersEnum.SYSTEM });
    if (!user) throw new Error('User not found');
    // Verify the password
    const isMatch = await verifying(user.password, password);
    if (!isMatch) throw new BadRequestException("Bad Request", "Invalid email or password", "INVALID_CREDENTIALS");
    const { accessToken, refreshToken } = buildTokens(user);

    return { user, accessToken, refreshToken };
}

// Refresh Token Service
export const refreshTokenService = async (userRefreshToken) => {
    const { user } = await decodeToken({ token: userRefreshToken, tokenType: tokenTypeEnum.REFRESH_TOKEN });
    // const { accessToken } = buildTokens(user);
    const tokenPayload = { id: user._id, email: user.email, role: user.role };
    const accessToken = generateToken(tokenPayload, user.role, tokenTypeEnum.ACCESS_TOKEN);
    return { message: 'Access token refreshed successfully', accessToken };
}

// Verify Id Token Service - Google
export const verifyIdTokenService = async (token) => {
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: envConfig.google.GCP_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
}

// Update Or Create User Service - Google
export const updateOrCreateUserService = async (user, googleTokenPayload) => {
    const { sub, email, given_name, family_name, email_verified } = googleTokenPayload;
    if (!email_verified) throw new BadRequestException({ message: 'Email not verified by Google' });
    if (user) {
        return userRepo.findByIdAndUpdateDocument(user._id, { email, firstName: given_name, lastName: family_name }, { new: true });
    } else {
        // Create
        const hashedPassword = await hashing(sub); // Use Google sub as password (hashed)
        return userRepo.createDocument({ email, firstName: given_name, lastName: family_name, googleSub: sub, provider: providersEnum.GOOGLE, password: hashedPassword });
    }
}

// Google Register Service
export const googleRegisterService = async (idToken) => {
    const googleTokenPayload = await verifyIdTokenService(idToken);
    if (!googleTokenPayload || !googleTokenPayload.email_verified) throw new BadRequestException({ message: 'Invalid Google ID token' });
    const user = await userRepo.findOneDocument({ googleSub: googleTokenPayload.sub, provider: providersEnum.GOOGLE });
    const handledUser = await updateOrCreateUserService(user, googleTokenPayload);
    // Generate JWT Access Token
    const { accessToken, refreshToken } = buildTokens(handledUser);
    return { message: 'Google register successful', data: handledUser, accessToken, refreshToken };
}

// Google Login Service
export const googleLoginService = async (idToken) => {
    const googleTokenPayload = await verifyIdTokenService(idToken);
    if (!googleTokenPayload || !googleTokenPayload.email_verified) throw new BadRequestException({ message: 'Not Verified User Email' });
    const user = await userRepo.findOneDocument({ googleSub: googleTokenPayload.sub, provider: providersEnum.GOOGLE });
    if (!user) throw new BadRequestException({ message: 'User not found' });
    const { accessToken, refreshToken } = buildTokens(user);

    return { message: 'Google login successful', data: user, accessToken, refreshToken };
}

// Logout User Service
export const logoutUserService = async (accessTokenData, refreshTokenData) => {
    const { exp: accessExpiration, jti: accessId } = accessTokenData;
    const { exp: refreshExpiration, jti: refreshId } = refreshTokenData;
    // Calculating TTL
    const accessTTL = calculateTTL(accessExpiration);
    const refreshTTL = calculateTTL(refreshExpiration);
    if (accessTTL <= 0 || refreshTTL <= 0) {
        throw new BadRequestException({
            message: 'Token has already expired'
        });
    }
    await Promise.all([
        set(`bl_${tokenTypeEnum.ACCESS_TOKEN}_${accessId}`, 'true', { EX: accessTTL }),
        set(`bl_${tokenTypeEnum.REFRESH_TOKEN}_${refreshId}`, 'true', { EX: refreshTTL }),
    ])
    return { accessTTL, refreshTTL };
}

// Confirm Email Service
export const confirmEmailService = async (email, otp) => {
    // Get Hashed Value From Redis
    const hashedOTP = await get(`email_verification_${email}`);
    if (!hashedOTP) throw new BadRequestException({ message: 'OTP has expired or already used' });
    // Compare Hashed Value with the one sent to the user
    const isMatch = await verifying(hashedOTP, otp.toString());
    if (!isMatch) throw new BadRequestException({ message: 'Invalid OTP' });
    // Update DB
    await userRepo.findAndUpdateDocument({ email }, { isEmailVerified: true });
    // Delete Hashed Value From Redis
    await del(`email_verification_${email}`);
}

// Resend OTP Service
export const resendOTPService = async (email) => {
    const user = await userRepo.findUserByEmail(email);
    if (!user || user.isEmailVerified) throw new BadRequestException({ message: 'User not found or already verified' });
    await handlingOTP(email, user.firstName);

    return { message: 'OTP sent successfully' };
};

// Forgot Password Service (For System Users Only)
export const forgotPasswordService = async (email) => {
    const user = await userRepo.findOneDocument({
        email,
        provider: providersEnum.SYSTEM
    });
    if (!user) throw new BadRequestException({ message: 'User not found' });
    await handlingOTP(email, user.firstName, 'forgot_password');

    return { message: 'OTP sent successfully' };
};

// Reset Password Service
export const resetPasswordService = async (body) => {
    const { email, otp, password } = body;
    const user = await userRepo.findOneDocument({
        email,
        provider: providersEnum.SYSTEM
    });
    if (!user) throw new BadRequestException({ message: 'User not found' });
    const hashedOTP = await get(`forgot_password_${email}`);
    if (!hashedOTP) throw new BadRequestException({ message: 'OTP has expired or already used' });
    const isMatch = await verifying(hashedOTP, otp.toString());
    if (!isMatch) throw new BadRequestException({ message: 'Invalid OTP' });
    const hashedPassword = await hashing(password);
    await userRepo.findAndUpdateDocument({ _id: user._id }, { password: hashedPassword });
    await del(`forgot_password_${email}`);

    return { message: 'Password reset successfully' };
};