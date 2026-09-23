// import User from "../../DB/Models/user.model.js";
import UserRepository from "../../DB/Repositories/user.repository.js";
import { BadRequestException, ConflictException } from "../../Utils/Errors/exception.error.js";
import { encrypt } from "../../Utils/Security/encryption.security.js";
import { hashing, verifying } from "../../Utils/Security/hash.security.js";
// import HttpAppError from "../../Utils/Errors/app.error.js";

// Repo
const userRepo = new UserRepository();

// Register User Service
export const registerUserService = async (body) => {
    const { firstName, lastName, email, password, gender, age, phoneNumber } = body;
    // const isEmailExists = await User.findOne({ email: { $regex: email, $options: 'i' } });
    const isEmailExists = await userRepo.findUserByEmail(email);
    // if (isEmailExists) throw new Error('Email already exists', { cause: { status: 409 } });
    // if (isEmailExists) throw new HttpAppError('Email already exists', 409, { duplicatedEmail: email }, 'DUPLICATED_EMAIL');
    if (isEmailExists) throw new ConflictException('Email already exists', { duplicatedEmail: email }, 'DUPLICATED_EMAIL');
    // Encrypt phone number before saving to the database
    let encryptedPhoneNumber;
    if (phoneNumber) encryptedPhoneNumber = encrypt(phoneNumber)
    // Hashing password before saving to the database
    const hashedPassword = await hashing(password);
    // const user = await User.create({ firstName, lastName, email, password: hashedPassword, gender, age, phoneNumber: encryptedPhoneNumber || undefined });
    const user = await userRepo.createDocument({ firstName, lastName, email, password: hashedPassword, gender, age, phoneNumber: encryptedPhoneNumber || undefined });
    return user;
}

// Login User Service
export const loginUserService = async (body) => {
    const { email, password } = body;
    // const user = await User.findOne({ email });
    const user = await userRepo.findUserByEmail(email);
    if (!user) throw new Error('User not found');
    // Verify the password
    const isMatch = await verifying(user.password, password);
    console.log(isMatch)
    // if (!isMatch) throw new Error('Invalid email or password');
    if (!isMatch) throw new BadRequestException("INVALID_EMAIL_OR_PASSWORD");
    return user;
} 