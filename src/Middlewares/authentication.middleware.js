import envConfig from "../Config/env.config.js";
import UserRepository from "../DB/Repositories/user.repository.js";
import { BadRequestException } from "../Utils/Errors/exception.error.js";
import { verifyToken } from "../Utils/token.utils.js";

const userRepo = new UserRepository();
export const authenticate = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        throw new BadRequestException({ message: 'Authorization header is missing' });
    }

    // Bearer token format check
    const [prefix, token] = authorization.split(' ');
    if (prefix !== 'Bearer' || !token) {
        throw new BadRequestException({ message: 'Invalid authorization format. Expected "Bearer <token>"' });
    }

    const decodedToken = verifyToken(token, envConfig.jwt.ACCESS_TOKEN_SECRET);
    // Find User in DB
    const user = await userRepo.findDocumentById(decodedToken.id);
    if (!user) throw new BadRequestException({ message: 'User not found' });

    req.authUser = user;

    next();
}

// export const authorize = (data) => {
//     return (req, res, next) => {}
// }