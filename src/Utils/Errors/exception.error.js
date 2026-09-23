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