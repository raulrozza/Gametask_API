"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const environment_1 = __importDefault(require("@config/environment"));
const VALID_DAYS = 7;
const EXPIRES_IN = VALID_DAYS * 86400;
class JwtTokenProvider {
    async verify(token) {
        try {
            const result = await jsonwebtoken_1.default.verify(token, String(environment_1.default.SECRET_KEY));
            return result;
        }
        catch (_a) {
            return null;
        }
    }
    async sign(payload) {
        const token = await jsonwebtoken_1.default.sign(payload, String(environment_1.default.SECRET_KEY), {
            expiresIn: EXPIRES_IN,
        });
        return token;
    }
}
exports.default = JwtTokenProvider;
