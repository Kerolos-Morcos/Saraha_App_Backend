import { Router } from 'express';
import { registerUserService, loginUserService, refreshTokenService, googleLoginService, googleRegisterService, logoutUserService, confirmEmailService, resendOTPService, forgotPasswordService, resetPasswordService, sendTwoFactorAuthService, enableTwoFactorAuthService, verifyTwoFactorLoginService } from './auth.service.js';
import { confirmEmailSchema, emailSchema, loginSchema, OTPSchema, registerSchema, resetPasswordSchema } from './auth.validation.js';
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
    const check2FA = result.requiresTwoFactor;
    
    res.status(200).json({ message: check2FA ? 'Required 2FA to login' : 'User logged in successfully', data: result });
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
authController.patch('/confirm-email', validation(confirmEmailSchema), async (req, res) => {
    const { email, otp } = req.result;
    await confirmEmailService(email, otp.toString());
    res.status(200).json({ message: 'Email confirmed successfully' });
});

// Resend OTP Route
authController.post('/resend-otp', validation(emailSchema), async (req, res) => {
    const { email } = req.result;
    const result = await resendOTPService(email);
    res.status(200).json(result);
});

// Forgot Password Route
authController.post('/forgot-password', validation(emailSchema), async (req, res) => {
    const { email } = req.result;
    const result = await forgotPasswordService(email);
    res.status(200).json(result);
})

// Reset Password Route
authController.post('/reset-password', validation(resetPasswordSchema), async (req, res) => {
    const { email, otp, password } = req.result;
    const result = await resetPasswordService({ email, otp, password });
    res.status(200).json(result);
});

// Send 2FA OTP Route
authController.post('/send-2fa', authenticate, async (req, res) => {
    const { email } = req.authUser;
    const result = await sendTwoFactorAuthService(email);
    res.status(200).json(result);
});

// Enable 2FA Route
authController.post('/enable-2fa', authenticate, validation(OTPSchema), async (req, res) => {
    const { email } = req.authUser;
    const { otp } = req.result;
    const result = await enableTwoFactorAuthService(email, otp);
    res.status(200).json(result);
});

// Login With 2FA Route
authController.post('/2fa-login', validation(confirmEmailSchema), async (req, res) => {
    const { email, otp } = req.result;
    const result = await verifyTwoFactorLoginService(email, otp);
    res.status(200).json(result);
});

export default authController;