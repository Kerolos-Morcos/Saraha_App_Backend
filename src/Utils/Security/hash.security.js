import * as argon2 from 'argon2';

// Hash password
export const hashing = async (password) => {
    try {
        const hashedPassword = await argon2.hash(password);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
    }
};

// Verify password
export const verifying = async (hashedPassword, plainPassword) => {
    try {
        const isMatch = await argon2.verify(hashedPassword, plainPassword);
        return isMatch;
    } catch (error) {
        console.error('Error verifying password:', error);
        throw error;
    }
};