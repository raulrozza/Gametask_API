"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorCodes_1 = __importDefault(require("@config/errorCodes"));
const internalErrorHandler = (error, request, response, next) => {
    console.error(error);
    const responseError = {
        message: 'Internal server error',
        errorCode: errorCodes_1.default.INTERNAL_SERVER_ERROR,
    };
    return response.status(500).json(responseError);
};
exports.default = internalErrorHandler;
