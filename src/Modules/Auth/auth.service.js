import User from "../../DB/Models/user.model.js";
import { encrypt } from "../../Utils/Security/encryption.security.js";
import { hashing, verifying } from "../../Utils/Security/hash.security.js";

// Register User Service
export const registerUserService = async (body) => {
    const { firstName, lastName, email, password, gender, age, phoneNumber } = body;
    const isEmailExists = await User.findOne({ email: { $regex: email, $options: 'i' } });
    if (isEmailExists) throw new Error('Email already exists');
    // Encrypt phone number before saving to the database
    let encryptedPhoneNumber;
    if (phoneNumber) encryptedPhoneNumber = encrypt(phoneNumber)
    // Hashing password before saving to the database
    const hashedPassword = await hashing(password);
    const user = await User.create({ firstName, lastName, email, password: hashedPassword, gender, age, phoneNumber: encryptedPhoneNumber || undefined });
    return user;
}

// Login User Service
export const loginUserService = async (body) => {
    const { email, password } = body;
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');
    // Verify the password
    const isMatch = await verifying(user.password, password);
    console.log(isMatch)
    if (!isMatch) throw new Error('Invalid email or password');
    return user;
} 