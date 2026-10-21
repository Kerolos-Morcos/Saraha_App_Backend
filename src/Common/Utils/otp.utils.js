import crypto from 'crypto';
import { hashing } from './Security/hash.security.js';
import { set } from '../Services/redis.service.js';
import { eventEmitter } from '../Services/email.service.js';
import { OTPExpirationTime } from '../constants.js';

export const generateOTP = () => crypto.randomInt(100000, 1000000).toString();

export async function handlingOTP(email, firstName) {
    // Generate OTP
    const otp = generateOTP();
    // Hash OTP
    const hashedOTP = await hashing(otp);
    // Sending Email Verification
    eventEmitter.emit("sendMailEvent", {
        to: email,
        firstName,
        otp
    });
    // Set OTP in Redis
    await set(`email_verification_${email}`, hashedOTP, { EX: OTPExpirationTime });
}