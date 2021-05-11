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
let CreateUnlockAchievementRequestService = class CreateUnlockAchievementRequestService {
    constructor(unlockAchievementRequestRepository, gamesRepository, achievementsRepository, playersRepository, transactionProvider) {
        this.unlockAchievementRequestRepository = unlockAchievementRequestRepository;
        this.gamesRepository = gamesRepository;
        this.achievementsRepository = achievementsRepository;
        this.playersRepository = playersRepository;
        this.transactionProvider = transactionProvider;
    }
    async execute({ userId, gameId, requester, achievement, requestDate, information, }) {
        await this.validateInput({
            userId,
            gameId,
            requester,
            achievement,
        });
        return await this.transactionProvider.startSession(async (session) => {
            const request = await this.unlockAchievementRequestRepository.create({
                achievement,
                game: gameId,
                requestDate,
                information,
                requester,
            }, session);
            await this.gamesRepository.updateRegisters(gameId, 1, session);
            return request;
        });
    }
    async validateInput({ userId, gameId, requester, achievement, }) {
        const game = await this.gamesRepository.findOne(gameId);
        if (!game)
            throw new implementations_1.RequestError('Game not found', errorCodes_1.default.BAD_REQUEST_ERROR, 404);
        const player = await this.playersRepository.findOne(requester, userId, gameId);
        if (!player)
            throw new implementations_1.RequestError('This player does not exist', errorCodes_1.default.BAD_REQUEST_ERROR, 404);
        const foundAchievement = await this.achievementsRepository.findOne(achievement, gameId);
        if (!foundAchievement)
            throw new implementations_1.RequestError('This achievement does not exist', errorCodes_1.default.BAD_REQUEST_ERROR, 404);
        const alreadyRequested = await this.unlockAchievementRequestRepository.checkIfRequested(requester, gameId, achievement);
        if (alreadyRequested)
            throw new implementations_1.RequestError('This achievement was already requested', errorCodes_1.default.ACHIEVEMENT_REGISTER_ALREADY_EXISTS);
        if (player.achievements.includes(achievement))
            throw new implementations_1.RequestError('This player already has this achievement', errorCodes_1.default.ACHIEVEMENT_BELONGS_TO_PLAYER);
    }
};
CreateUnlockAchievementRequestService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UnlockAchievementRequestRepository')),
    __param(1, tsyringe_1.inject('GamesRepository')),
    __param(2, tsyringe_1.inject('AchievementsRepository')),
    __param(3, tsyringe_1.inject('PlayersRepository')),
    __param(4, tsyringe_1.inject('TransactionProvider')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], CreateUnlockAchievementRequestService);
exports.default = CreateUnlockAchievementRequestService;
