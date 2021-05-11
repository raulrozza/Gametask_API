"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const UsersRepository_1 = __importDefault(require("@modules/users/infra/mongoose/repositories/UsersRepository"));
const BCryptHashProvider_1 = __importDefault(require("@modules/users/providers/HashProvider/implementations/BCryptHashProvider"));
const JwtTokenProvider_1 = __importDefault(require("./TokenProvider/implementations/JwtTokenProvider"));
tsyringe_1.container.registerSingleton('UsersRepository', UsersRepository_1.default);
tsyringe_1.container.registerSingleton('HashProvider', BCryptHashProvider_1.default);
tsyringe_1.container.registerSingleton('TokenProvider', JwtTokenProvider_1.default);
