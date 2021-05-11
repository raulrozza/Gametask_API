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
let UnlockAchievementService = class UnlockAchievementService {
    constructor(playersRepository, achievementsRepository, unlockAchievementRequestRepository, gamesRepository, feedPostsRepository, transactionProvider) {
        this.playersRepository = playersRepository;
        this.achievementsRepository = achievementsRepository;
        this.unlockAchievementRequestRepository = unlockAchievementRequestRepository;
        this.gamesRepository = gamesRepository;
        this.feedPostsRepository = feedPostsRepository;
        this.transactionProvider = transactionProvider;
    }
    async execute({ userId, requestId, playerId, gameId, achievementId, }) {
        await this.validateInput({
            userId,
            requestId,
            playerId,
            gameId,
        });
        const achievementTitle = await this.retrieveAchievementTitleId({
            achievementId,
            gameId,
        });
        await this.transactionProvider.startSession(async (session) => {
            await this.playersRepository.unlockAchievement(playerId, achievementId, achievementTitle, session);
            await this.unlockAchievementRequestRepository.delete(requestId, gameId, session);
            await this.gamesRepository.updateRegisters(gameId, -1, session);
            await this.feedPostsRepository.create({
                game: gameId,
                player: playerId,
                type: 'achievement',
                achievement: achievementId,
            });
        });
    }
    async validateInput({ userId, requestId, playerId, gameId, }) {
        const player = await this.playersRepository.findOne(playerId, userId, gameId);
        if (!player)
            throw new implementations_1.RequestError('This player does not exist', errorCodes_1.default.BAD_REQUEST_ERROR);
        const request = await this.unlockAchievementRequestRepository.findOne(requestId);
        if (!request)
            throw new implementations_1.RequestError('You should first request this achievement to be unlocked', errorCodes_1.default.BAD_REQUEST_ERROR);
    }
    async retrieveAchievementTitleId({ achievementId, gameId, }) {
        const achievement = await this.achievementsRepository.findOne(achievementId, gameId);
        if (!achievement)
            throw new implementations_1.RequestError('This achievement does not exist', errorCodes_1.default.BAD_REQUEST_ERROR);
        const title = achievement.title;
        if (typeof title === 'string')
            return title;
        return title === null || title === void 0 ? void 0 : title.id;
    }
};
UnlockAchievementService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('PlayersRepository')),
    __param(1, tsyringe_1.inject('AchievementsRepository')),
    __param(2, tsyringe_1.inject('UnlockAchievementRequestRepository')),
    __param(3, tsyringe_1.inject('GamesRepository')),
    __param(4, tsyringe_1.inject('FeedPostsRepository')),
    __param(5, tsyringe_1.inject('TransactionProvider')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], UnlockAchievementService);
exports.default = UnlockAchievementService;
