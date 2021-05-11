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
const GAME_FOLDER = 'game';
let UpdateGameAvatarService = class UpdateGameAvatarService {
    constructor(gamesRepository, storageProvider) {
        this.gamesRepository = gamesRepository;
        this.storageProvider = storageProvider;
    }
    async execute({ filename, id, userId }) {
        try {
            const game = await this.gamesRepository.findOne(id, userId);
            if (!game) {
                throw new implementations_1.RequestError('Could not find game on database', errorCodes_1.default.RESOURCE_NOT_FOUND);
            }
            if (game.image)
                await this.storageProvider.deleteFile(game.image, GAME_FOLDER);
            await this.storageProvider.saveFile(filename, GAME_FOLDER);
            const updatedGame = await this.gamesRepository.update({
                id: game.id,
                name: game.name,
                description: game.description,
                levelInfo: game.levelInfo,
                ranks: game.ranks,
                newRegisters: game.newRegisters,
                theme: game.theme,
                administrators: game.administrators,
                image: filename,
            });
            return updatedGame;
        }
        catch (error) {
            if (error instanceof implementations_1.RequestError)
                throw error;
            throw new implementations_1.RequestError(error.message, errorCodes_1.default.INTERNAL_SERVER_ERROR, 500);
        }
    }
};
UpdateGameAvatarService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('GamesRepository')),
    __param(1, tsyringe_1.inject('StorageProvider')),
    __metadata("design:paramtypes", [Object, Object])
], UpdateGameAvatarService);
exports.default = UpdateGameAvatarService;
