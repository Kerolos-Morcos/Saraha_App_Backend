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

// Generate Role Token
export const generateRoleToken = (payload, role, tokenType) => {
    const { secret, expiresIn } = getTokenConfig(role, tokenType);

    if (!secret || !expiresIn) {
        throw new Error("JWT configuration is missing");
    }

    return generateToken(payload, secret, { expiresIn });
};

export const verifyToken = (token, secret) => {
    return jwt.verify(token, secret);
}

// Verifying and Decoding token
export const decodeToken = async ({ token, tokenType }) => {
    // decoding the token without verifying the signature
    const data = getDecodedToken(token);

    // Get the appropriate signature based on the token type
    const { secret } = getTokenConfig(data.role, tokenType);

    if (!secret) {
        throw new Error("JWT secret is missing");
    }

    const verifiedToken = verifyToken(token, secret);

    // Find User in DB
    const user = await userRepo.findDocumentById(verifiedToken.id);
    if (!user) throw new BadRequestException({ message: 'User not found' });

    return user;
}

// Get Decoded Token
const getDecodedToken = (token) => {
    const data = jwt.decode(token);

    if (!data || !data.role) {
        throw new BadRequestException("Invalid token payload");
    }

    return data;
};

// Get Role Token Config
export const getRoleTokenConfig = (role) => {
    const config = envConfig.jwt[role];
    if (!config) throw new BadRequestException("Invalid user role");

    return config;
};

// Get Token Signature based on role and token type
export const getTokenConfig = (role, tokenType) => {
    const roleConfig = getRoleTokenConfig(role);

    switch (tokenType) {
        case tokenTypeEnum.ACCESS_TOKEN:
            return {
                secret: roleConfig.ACCESS_TOKEN_SECRET,
                expiresIn: roleConfig.ACCESS_TOKEN_EXPIRATION_TIME
            };

        case tokenTypeEnum.REFRESH_TOKEN:
            return {
                secret: roleConfig.REFRESH_TOKEN_SECRET,
                expiresIn: roleConfig.REFRESH_TOKEN_EXPIRATION_TIME
            };

        default:
            throw new BadRequestException("Invalid token type");
    }
};