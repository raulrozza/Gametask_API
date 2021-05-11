"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const AuthenticateUserService_1 = __importDefault(require("@modules/users/services/AuthenticateUserService"));
class AuthenticationController {
    constructor() {
        this.store = async (request, response) => {
            const { email, password } = request.body;
            const authenticateUser = tsyringe_1.container.resolve(AuthenticateUserService_1.default);
            const authentication = await authenticateUser.execute({ email, password });
            return response.json(authentication);
        };
    }
}
exports.default = AuthenticationController;
