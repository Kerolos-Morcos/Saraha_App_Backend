import { UnauthorizedException } from "../Common/Utils/Errors/exception.error.js";

export const authorize = (allowedRoles) => {
    return (req, res, next) => {
        const loggedInUserRole = req.authUser.role;
        if (!allowedRoles.includes(loggedInUserRole)) {
            throw new UnauthorizedException(`User role '${loggedInUserRole}' is not authorized to access this resource`, { userRole: loggedInUserRole }, 'UNAUTHORIZED_ACCESS');
        }
        next();
    }
}