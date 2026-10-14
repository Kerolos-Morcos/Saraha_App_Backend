import { Router } from 'express';
import { registerUserService, loginUserService, refreshTokenService } from './auth.service.js';
import { loginSchema, registerSchema } from './auth.validation.js';
import { validation } from '../../Middlewares/validation.middleware.js';
import { BadRequestException } from '../../Common/Utils/Errors/exception.error.js';

const authController = Router();

// Register Route
authController.post('/register', validation(registerSchema), async (req, res) => {
    const result = await registerUserService(req.result);
    res.status(201).json({ message: 'User registered successfully', data: result });
});

// Login Route
authController.post('/login', validation(loginSchema), async (req, res) => {
    const result = await loginUserService(req.result);
    res.status(200).json({ message: 'User logged in successfully', data: result });
});

// Refresh Token Route
authController.post('/refresh-token', async (req, res) => {
    const { refresh_token } = req.headers;
    if (!refresh_token) throw new BadRequestException({ message: 'Refresh token is missing' });
    const result = await refreshTokenService(refresh_token);
    res.status(200).json({ message: 'Access token refreshed successfully', data: result });
});

export default authController;