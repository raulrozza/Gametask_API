"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const implementations_1 = require("@shared/errors/implementations");
const requestErrorHandler = (error, _, response, next) => {
    if (error instanceof implementations_1.RequestError) {
        return response.status(error.statusCode).json(error.toJsonResponse());
    }
    return next();
};
exports.default = requestErrorHandler;
