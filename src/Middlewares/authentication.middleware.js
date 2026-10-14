import { tokenTypeEnum } from "../Common/constants.js";
import { BadRequestException } from "../Common/Utils/Errors/exception.error.js";
import { decodeToken } from "../Common/Utils/token.utils.js";

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

    const user = await decodeToken({ token, tokenType: tokenTypeEnum.ACCESS_TOKEN });
    req.authUser = user;

    next();
}