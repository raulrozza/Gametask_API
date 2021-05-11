"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });
exports.default = {
    PORT: process.env.PORT,
    SECRET_KEY: process.env.SECRET_KEY,
    MONGO_URL: process.env.MONGO_URL,
    CORS_CONFIG: process.env.CORS_CONFIG,
    ADDRESS: process.env.ADDRESS,
};
