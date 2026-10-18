import { tokenTypeEnum } from "../Common/constants.js";
import { BadRequestException } from "../Common/Utils/Errors/exception.error.js";
import { decodeToken } from "../Common/Utils/token.utils.js";

export const decodeRefreshToken = async (req, res, next) => {
    const { refresh_token } = req.headers;
    if (!refresh_token) throw new BadRequestException({ message: 'Authorization header is missing' });

    // Bearer token format check
    const [prefix, token] = refresh_token.split(' ');
    if (prefix !== 'Bearer' || !token) {
        throw new BadRequestException({ message: 'Invalid authorization format. Expected "Bearer <token>"' });
    }

    const { tokenData } = await decodeToken({ token, tokenType: tokenTypeEnum.REFRESH_TOKEN });
    req.refreshTokenData = tokenData;

    next();
}