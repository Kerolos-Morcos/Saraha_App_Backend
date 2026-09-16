import { Router } from 'express';
import { deleteUserProfileService, getAllUsersService, getUserProfileService, updateUserProfileService } from './user.service.js';

const userController = Router();

// GET user profile by id
userController.get('/profile/:userId', async (req, res) => {
    try {
        const user = await getUserProfileService(req.params.userId);
        res.status(200).json({ message: 'User profile retrieved successfully', data: user });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// GET all users
userController.get('/', async (req, res) => {
    try {
        const users = await getAllUsersService();
        res.status(200).json({ message: 'All users retrieved successfully', data: users });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Update user profile by id
userController.patch('/update/:userId', async (req, res) => {
    try {
        const updatedUser = await updateUserProfileService(req.params.userId, req.body);
        res.status(200).json({ message: 'User profile updated successfully', data: updatedUser });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Delete user profile by id
userController.delete('/delete/:userId', async (req, res) => {
    try {
        const deletedUser = await deleteUserProfileService(req.params.userId);
        res.status(200).json({ message: 'User profile deleted successfully', data: deletedUser });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

export default userController;