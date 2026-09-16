import { isValidObjectId } from "mongoose";
import User from "../../DB/Models/user.model.js";
import { decrypt } from "../../Utils/Security/encryption.security.js";

// GET user profile by id
export const getUserProfileService = async (userId) => {
    if (!isValidObjectId(userId)) throw new Error('Invalid user ID');
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    // Decrypt the phone number before returning the user object
    if (user.phoneNumber)
        user.phoneNumber = decrypt(user.phoneNumber);
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

// Update user profile by id using save
// export const updateUserProfileService = async (userId, body) => {
//     const { firstName, lastName, email, age, gender, phoneNumber } = body;
//     const user = await User.findById(userId);
//     if (!isValidObjectId(userId)) throw new Error('Invalid user ID');
//     if (!user) throw new Error('User not found');
//     if (firstName) user.firstName = firstName;
//     if (lastName) user.lastName = lastName;
//     if (email) user.email = email;
//     if (age) user.age = age;
//     if (gender) user.gender = gender;
//     if (phoneNumber) user.phoneNumber = phoneNumber;
//     await user.save();
//     return user;
// }

// Update user profile by id using findByIdAndUpdate
export const updateUserProfileService = async (userId, body) => {
    const { firstName, lastName, email, age, gender, phoneNumber } = body;
    if (!isValidObjectId(userId)) throw new Error('Invalid user ID');
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { firstName, lastName, email, age, gender, phoneNumber },
        { new: true, runValidators: true }
    );
    if (!updatedUser) throw new Error('User not found');
    return updatedUser;
}

// Delete user profile by id
export const deleteUserProfileService = async (userId) => {
    if (!isValidObjectId(userId)) throw new Error('Invalid user ID');
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) throw new Error('User not found');
    return deletedUser;
}