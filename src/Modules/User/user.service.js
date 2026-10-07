import { isValidObjectId } from "mongoose";
import { decrypt } from "../../Utils/Security/encryption.security.js";
import UserRepository from "../../DB/Repositories/user.repository.js";

// Repo
const userRepo = new UserRepository();

// GET user profile by id
export const getUserProfileService = async (user) => {
    // Decrypt the phone number before returning the user object
    if (user.phoneNumber)
        user.phoneNumber = decrypt(user.phoneNumber);
    return user;
}

// GET all users
export const getAllUsersService = async () => {
  return userRepo.findAllUserDocuments();
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
    const updatedUser = await userRepo.findByIdAndUpdateDocument(userId, { firstName, lastName, email, age, gender, phoneNumber }, { new: true, runValidators: true });
    if (!updatedUser) throw new Error('User not found');
    return updatedUser;
}

// Delete user profile by id
export const deleteUserProfileService = async (userId) => {
    if (!isValidObjectId(userId)) throw new Error('Invalid user ID');
    const deletedUser = await userRepo.findByIdAndDeleteDocument(userId);
    if (!deletedUser) throw new Error('User not found');
    return deletedUser;
}