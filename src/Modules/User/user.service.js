import { isValidObjectId } from "mongoose";
import User from "../../DB/Models/user.model.js";
import { decrypt } from "../../Utils/Security/encryption.security.js";

// GET user profile by id
export const getUserProfileService = async (userId) => {
    const user = await User.findById(userId);
    // Decrypt the phone number before returning the user object
    if (user.phoneNumber)
        user.phoneNumber = decrypt(user.phoneNumber);
    if (!isValidObjectId(userId)) throw new Error('Invalid user ID');
    if (!user) throw new Error('User not found');
    return user;
}

// GET all users
export const getAllUsersService = async () => {
    return User.find()
        .select('firstName lastName')
        .sort({ firstName: -1 }) // descending order
        .limit(2)
        .skip(1);
}