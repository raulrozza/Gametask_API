"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const tsyringe_1 = require("tsyringe");
const errorCodes_1 = __importDefault(require("@config/errorCodes"));
const implementations_1 = require("@shared/errors/implementations");
const PASSWORD_EMAIL_ERROR_MESSAGE = 'Invalid combination of email/password';
let AuthenticateUserService = class AuthenticateUserService {
    constructor(usersRepository, hashProvider, tokenProvider) {
        this.usersRepository = usersRepository;
        this.hashProvider = hashProvider;
        this.tokenProvider = tokenProvider;
    }
    async execute({ email, password, }) {
        const foundUser = await this.usersRepository.findOneByEmail(email);
        if (!foundUser)
            throw new implementations_1.RequestError(PASSWORD_EMAIL_ERROR_MESSAGE, errorCodes_1.default.USER_PASSWORD_DONT_MATCH);
        const match = await this.hashProvider.compareHash(password, foundUser.password);
        if (!match)
            throw new implementations_1.RequestError(PASSWORD_EMAIL_ERROR_MESSAGE, errorCodes_1.default.USER_PASSWORD_DONT_MATCH);
        const token = await this.tokenProvider.sign({
            id: foundUser.id,
            name: foundUser.firstname,
            profile_url: foundUser.profile_url,
        });
        return { token };
    }
};
AuthenticateUserService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UsersRepository')),
    __param(1, tsyringe_1.inject('HashProvider')),
    __param(2, tsyringe_1.inject('TokenProvider')),
    __metadata("design:paramtypes", [Object, Object, Object])
], AuthenticateUserService);
exports.default = AuthenticateUserService;
