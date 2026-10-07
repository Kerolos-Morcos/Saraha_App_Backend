import jwt from "jsonwebtoken";

// VIP: Single Source of truth
export const generateToken = (payload, secret, options) => {
    return jwt.sign(payload, secret, options);
}

export const verifyToken = (token, secret) => {
    return jwt.verify(token, secret);
}