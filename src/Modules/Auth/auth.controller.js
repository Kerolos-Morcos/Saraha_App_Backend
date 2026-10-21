import { Router } from 'express';
import { registerUserService, loginUserService, refreshTokenService, googleLoginService, googleRegisterService, logoutUserService, confirmEmailService } from './auth.service.js';
import { loginSchema, registerSchema } from './auth.validation.js';
import { validation } from '../../Middlewares/validation.middleware.js';
import { BadRequestException } from '../../Common/Utils/Errors/exception.error.js';
import { authenticate } from '../../Middlewares/authentication.middleware.js';
import { decodeRefreshToken } from '../../Middlewares/decodeRefreshToken.middleware.js';

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

// Login With Google
authController.post('/google-login', async (req, res) => {
    const { idToken } = req.body;
    if (!idToken) throw new BadRequestException({ message: 'ID token is missing' });
    const result = await googleLoginService(idToken);
    res.status(200).json({ message: 'Google login successful', data: result });
});


// Register With Google
authController.post('/google-register', async (req, res) => {
    const { idToken } = req.body;
    if (!idToken) throw new BadRequestException({ message: 'ID token is missing' });
    const result = await googleRegisterService(idToken);
    res.status(201).json({ message: 'Google register successful', data: result });
});

// Logout Route
authController.post('/logout', authenticate, decodeRefreshToken, async (req, res) => {
    const result = await logoutUserService(req.accessTokenData, req.refreshTokenData);
    res.status(200).json({ message: 'User logged out successfully', data: result });
});

// Confirm Email Route
authController.patch('/confirm-email', async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) throw new BadRequestException({ message: 'Email or OTP is missing' });
    const result = await confirmEmailService(email, otp.toString());
    res.status(200).json({ message: 'Email confirmed successfully', data: result });
});

export default authController;