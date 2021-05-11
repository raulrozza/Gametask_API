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
const USER_FOLDER = 'user';
let UpdateUserAvatarService = class UpdateUserAvatarService {
    constructor(usersRepository, storageProvider) {
        this.usersRepository = usersRepository;
        this.storageProvider = storageProvider;
    }
    async execute({ filename, id }) {
        const user = await this.usersRepository.findOne(id);
        if (!user) {
            throw new implementations_1.RequestError('Could not find user on database', errorCodes_1.default.COULD_NOT_FIND_USER);
        }
        if (user.image)
            await this.storageProvider.deleteFile(user.image, USER_FOLDER);
        await this.storageProvider.saveFile(filename, USER_FOLDER);
        const updatedUser = await this.usersRepository.update({
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            password: user.password,
            image: filename,
        });
        return updatedUser;
    }
};
UpdateUserAvatarService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UsersRepository')),
    __param(1, tsyringe_1.inject('StorageProvider')),
    __metadata("design:paramtypes", [Object, Object])
], UpdateUserAvatarService);
exports.default = UpdateUserAvatarService;
