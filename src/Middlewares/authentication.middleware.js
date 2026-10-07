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
    const decodedToken = verifyToken(authorization, envConfig.jwt.ACCESS_TOKEN_SECRET);
    // Find User in DB
    const user = await userRepo.findDocumentById(decodedToken.id);
    if (!user) throw new BadRequestException({ message: 'User not found' });

    req.authUser = user;

    next();
}

// export const authorize = (data) => {
//     return (req, res, next) => {}
// }