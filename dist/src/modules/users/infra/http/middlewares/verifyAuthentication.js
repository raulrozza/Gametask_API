"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorCodes_1 = __importDefault(require("@config/errorCodes"));
const implementations_1 = require("@shared/errors/implementations");
const JwtTokenProvider_1 = __importDefault(require("@modules/users/providers/TokenProvider/implementations/JwtTokenProvider"));
const verifyAuthentication = async (request, _, next) => {
    const header = request.headers.authorization;
    if (!header)
        throw new implementations_1.RequestError('Authentication is needed to access this resource', errorCodes_1.default.INVALID_TOKEN, 403);
    const [, token] = header.split(' ');
    const tokenProvider = new JwtTokenProvider_1.default();
    const auth = await tokenProvider.verify(token);
    if (!auth)
        throw new implementations_1.RequestError('Invalid authentication token', errorCodes_1.default.INVALID_TOKEN, 401);
    request.auth = auth;
    return next();
};
exports.default = verifyAuthentication;
