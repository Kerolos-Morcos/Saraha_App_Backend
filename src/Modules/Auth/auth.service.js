import UserRepository from "../../DB/Repositories/user.repository.js";
import envConfig from "../../Config/env.config.js";
import { BadRequestException, ConflictException } from "../../Common/Utils/Errors/exception.error.js";
import { encrypt } from "../../Common/Utils/Security/encryption.security.js";
import { hashing, verifying } from "../../Common/Utils/Security/hash.security.js";
import { decodeToken, generateToken, getRoleTokenConfig } from "../../Common/Utils/token.utils.js";
import { tokenTypeEnum } from "../../Common/constants.js";

// Repo
const userRepo = new UserRepository();

// const { user: userEnvConfig, admin: adminEnvConfig } = envConfig.jwt;

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
    const user = await userRepo.createDocument({ firstName, lastName, email, password: hashedPassword, gender, age, phoneNumber: encryptedPhoneNumber || undefined });
    return user;
}

// Login User Service
export const loginUserService = async (body) => {
    const { email, password } = body;
    const user = await userRepo.findUserByEmail(email);
    if (!user) throw new Error('User not found');
    // Verify the password
    const isMatch = await verifying(user.password, password);
    if (!isMatch) throw new BadRequestException("Bad Request", "Invalid email or password", "INVALID_CREDENTIALS");

    // Check if the user role is valid
    const roleConfig = getRoleTokenConfig(user.role);
    if (!roleConfig) throw new BadRequestException("Invalid user role");

    // Generate JWT Access Token
    const accessToken = generateToken({ id: user._id, email: user.email, role: user.role }, roleConfig.ACCESS_TOKEN_SECRET, { expiresIn: roleConfig.ACCESS_TOKEN_EXPIRATION_TIME });

    // Generate JWT Refresh Token
    const refreshToken = generateToken({ id: user._id, email: user.email, role: user.role }, roleConfig.REFRESH_TOKEN_SECRET, { expiresIn: roleConfig.REFRESH_TOKEN_EXPIRATION_TIME });

    return { user, accessToken, refreshToken };
}

// Refresh Token Service
export const refreshTokenService = async (userRefreshToken) => {
    const user = await decodeToken({ token: userRefreshToken, tokenType: tokenTypeEnum.REFRESH_TOKEN });
    
    const roleConfig = getRoleTokenConfig(user.role);
    // Generate JWT Access Token
    const accessToken = generateToken({ id: user.id, email: user.email, role: user.role }, roleConfig.ACCESS_TOKEN_SECRET, { expiresIn: roleConfig.ACCESS_TOKEN_EXPIRATION_TIME });

    return { message: 'Access token refreshed successfully', accessToken };
}