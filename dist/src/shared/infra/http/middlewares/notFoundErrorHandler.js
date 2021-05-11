"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorCodes_1 = __importDefault(require("@config/errorCodes"));
const notFoundErrorHandler = (_, response) => {
    const errorResponse = {
        message: 'This resource does not exist',
        errorCode: errorCodes_1.default.RESOURCE_NOT_FOUND,
    };
    return response.status(404).json(errorResponse);
};
exports.default = notFoundErrorHandler;
