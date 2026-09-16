import { Router } from 'express';
import { registerUserService, loginUserService } from './auth.service.js';

const authController = Router();

// Register Route
authController.post('/register', async (req, res) => {
    const result = await registerUserService(req.body);
    res.status(201).json({ message: 'User registered successfully', data: result });
});

// Login Route
authController.post('/login', async (req, res) => {
    const result = await loginUserService(req.body);
    res.status(200).json({ message: 'User logged in successfully', data: result });
});

export default authController;