import crypto from "node:crypto";
import envConfig from "../../Config/env.config.js";

const enc_key = envConfig.encryption.ENCRYPTION_KEY;
// function to encrypt
const ENCRYPTION_KEY = Buffer.from(enc_key, 'hex');
const IV_LENGTH = envConfig.encryption.IV_LENGTH;
export const encrypt = (plainText) => {
    const iv = crypto.randomBytes(IV_LENGTH); // Buffer
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return `${iv.toString('hex')}:${encrypted}`;
};

// function to decrypt
export const decrypt = (cipher) => {
    const [ivHex, encrypted] = cipher.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
};