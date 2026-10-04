import HttpAppError from "./app.error.js";

export class BadRequestException extends HttpAppError {
    constructor(message = "Bad Request", data = {}, code = "BAD_REQUEST") {
        super(message, 400, data, code)
    }
}

export class ConflictException extends HttpAppError {
    constructor(message = "Conflict", data = {}, code = "CONFLICT") {
        super(message, 409, data, code)
    }
}

export class NotFoundException extends HttpAppError {
    constructor(message = "Not Found", data = {}, code = "NOT_FOUND") {
        super(message, 404, data, code)
    }
}

export class UnauthorizedException extends HttpAppError {
    constructor(message = "Unauthorized", data = {}, code = "UNAUTHORIZED") {
        super(message, 401, data, code)
    }
}

export class ForbiddenException extends HttpAppError {
    constructor(message = "Forbidden", data = {}, code = "FORBIDDEN") {
        super(message, 403, data, code)
    }
}

export class InternalServerErrorException extends HttpAppError {
    constructor(message = "Internal Server Error", data = {}, code = "INTERNAL_SERVER_ERROR") {
        super(message, 500, data, code)
    }
}

export class ServiceUnavailableException extends HttpAppError {
    constructor(message = "Service Unavailable", data = {}, code = "SERVICE_UNAVAILABLE") {
        super(message, 503, data, code)
    }
}