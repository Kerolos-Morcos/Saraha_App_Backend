import { Router } from 'express';
import { deleteUserProfileService, getAllUsersService, getUserProfileService, updateUserProfileService } from './user.service.js';
import { authenticate } from '../../Middlewares/authentication.middleware.js';

const userController = Router();

// GET user profile by id
userController.get('/profile', authenticate, async (req, res) => {
    try {
        const user = await getUserProfileService(req.authUser);
        res.status(200).json({
            message: 'User profile retrieved successfully',
            data: user
        });
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
userController.patch('/update', authenticate, async (req, res) => {
    try {
        const updatedUser = await updateUserProfileService(req.authUser._id, req.body);
        res.status(200).json({ message: 'User profile updated successfully', data: updatedUser });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Delete user profile by id
userController.delete('/delete', authenticate, async (req, res) => {
    try {
        const deletedUser = await deleteUserProfileService(req.authUser._id);
        res.status(200).json({ message: 'User profile deleted successfully', data: deletedUser });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

export default userController;