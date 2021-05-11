"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RequestError extends Error {
    constructor(message, errorCode, statusCode = 400) {
        super(message);
        this.message = message;
        this.errorCode = errorCode;
        this.statusCode = statusCode;
    }
    toJsonResponse() {
        const jsonResponse = {
            errorCode: this.errorCode,
            message: this.message,
        };
        return jsonResponse;
    }
}
exports.default = RequestError;
