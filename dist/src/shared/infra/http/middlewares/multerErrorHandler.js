"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorCodes_1 = __importDefault(require("@config/errorCodes"));
const multer_1 = require("multer");
const multerErrorHandler = (error, _, response, next) => {
    if (error instanceof multer_1.MulterError) {
        const responseJson = {
            errorCode: errorCodes_1.default.BAD_REQUEST_ERROR,
            message: error.message,
        };
        return response.status(400).json(responseJson);
    }
    return next();
};
exports.default = multerErrorHandler;
