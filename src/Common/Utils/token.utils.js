import jwt from "jsonwebtoken";
import { BadRequestException } from "./Errors/exception.error.js";
import envConfig from "../../Config/env.config.js";
import UserRepository from "../../DB/Repositories/user.repository.js";
import { tokenTypeEnum } from "../constants.js";

// const jwtConfig = envConfig.jwt;
const userRepo = new UserRepository();

// VIP: Single Source of truth
export const generateToken = (payload, secret, options) => {
    return jwt.sign(payload, secret, options);
}

export const verifyToken = (token, secret) => {
    return jwt.verify(token, secret);
}

// Verifying and Decoding token
export const decodeToken = async ({ token, tokenType }) => {
    // decoding the token without verifying the signature
    const data = getDecodedToken(token);

    // Get the appropriate signature based on the token type
    const signature = getTokenSignature(data.role, tokenType)
    if (!signature) throw new BadRequestException({ message: `Invalid role: ${data.role}` });

    // Verify Token
    const verifiedToken = verifyToken(token, signature);

    // Find User in DB
    const user = await userRepo.findDocumentById(verifiedToken.id);
    if (!user) throw new BadRequestException({ message: 'User not found' });

    return user;
}

// Get Decoded Token
const getDecodedToken = (token) => {
    const data = jwt.decode(token);
    if (!data || !data.role) throw new BadRequestException("Invalid token payload");

    return data;
};

// Get Role Token Config
export const getRoleTokenConfig = (role) => {
    const config = envConfig.jwt[role];
    if (!config) throw new BadRequestException("Invalid user role");

    return config;
};

// Get Token Signature based on role and token type
const getTokenSignature = (role, tokenType) => {
    const roleConfig = getRoleTokenConfig(role);
    switch (tokenType) {
        case tokenTypeEnum.ACCESS_TOKEN:
            return roleConfig.ACCESS_TOKEN_SECRET;
        case tokenTypeEnum.REFRESH_TOKEN:
            return roleConfig.REFRESH_TOKEN_SECRET;
        default:
            throw new BadRequestException("Invalid token type");
    }
};