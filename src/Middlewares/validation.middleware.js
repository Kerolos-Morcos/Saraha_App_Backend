import { BadRequestException } from "../Utils/Errors/exception.error.js";

export const validation = (schema) => {
    return (req, res, next) => {
        const data = {
            ...req.params,
            ...req.query,
            ...req.body
        };
        const validationResult = schema.safeParse(data);
        if (!validationResult.success) {
            throw new BadRequestException('Invalid data', validationResult.error?.issues, 'INVALID_DATA');
        }
        req.result = validationResult.data;
        next();
    }
}