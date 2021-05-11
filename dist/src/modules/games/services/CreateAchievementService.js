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
const implementations_1 = require("@shared/errors/implementations");
const errorCodes_1 = __importDefault(require("@config/errorCodes"));
let CreateAchievementService = class CreateAchievementService {
    constructor(achievementsRepository, titlesRepository) {
        this.achievementsRepository = achievementsRepository;
        this.titlesRepository = titlesRepository;
    }
    async execute({ gameId, name, description, title, }) {
        try {
            if (title) {
                const foundTitle = await this.titlesRepository.findOne(title, gameId);
                if (!foundTitle)
                    throw new implementations_1.RequestError('The title does not exist.', errorCodes_1.default.RESOURCE_NOT_FOUND, 404);
            }
            const createdAchievement = await this.achievementsRepository.create({
                name,
                description,
                game: gameId,
                title,
            });
            return createdAchievement;
        }
        catch (error) {
            if (error instanceof implementations_1.RequestError)
                throw error;
            throw new implementations_1.RequestError(error.message, errorCodes_1.default.INTERNAL_SERVER_ERROR, 500);
        }
    }
};
CreateAchievementService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('AchievementsRepository')),
    __param(1, tsyringe_1.inject('TitlesRepository')),
    __metadata("design:paramtypes", [Object, Object])
], CreateAchievementService);
exports.default = CreateAchievementService;
