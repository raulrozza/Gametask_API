"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const BCRYPT_SALT_ROUNDS = 12;
class BCryptHashProvider {
    async generateHash(payload) {
        const hashed = await bcryptjs_1.default.hash(payload, BCRYPT_SALT_ROUNDS);
        return hashed;
    }
    async compareHash(payload, hash) {
        const result = await bcryptjs_1.default.compare(payload, hash);
        return result;
    }
}
exports.default = BCryptHashProvider;
