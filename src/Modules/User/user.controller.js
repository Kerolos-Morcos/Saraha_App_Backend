import { Router } from 'express';
import { getAllUsersService, getUserProfileService } from './user.service.js';

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


export default userController;