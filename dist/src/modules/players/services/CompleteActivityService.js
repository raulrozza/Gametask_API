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
let CompleteActivityService = class CompleteActivityService {
    constructor(playersRepository, activitiesRepository, feedPostsRepository, completeActivityRequestRepository, leaderboardsRepository, gamesRepository, transactionProvider) {
        this.playersRepository = playersRepository;
        this.activitiesRepository = activitiesRepository;
        this.feedPostsRepository = feedPostsRepository;
        this.completeActivityRequestRepository = completeActivityRequestRepository;
        this.leaderboardsRepository = leaderboardsRepository;
        this.gamesRepository = gamesRepository;
        this.transactionProvider = transactionProvider;
    }
    async execute({ requestId, userId, }) {
        const request = await this.completeActivityRequestRepository.findOne(requestId);
        if (!request) {
            throw new implementations_1.RequestError('This request does not exist', errorCodes_1.default.BAD_REQUEST_ERROR);
        }
        const activityId = request.activity;
        const gameId = request.game;
        const playerId = request.requester;
        const activity = (await this.activitiesRepository.findOne(activityId, gameId));
        await this.transactionProvider.startSession(async (session) => {
            await this.addCompletionToActivityHistory({
                userId,
                completionDate: request.completionDate,
                activityId: activity.id,
            }, session);
            await this.finishRequest({ requestId: request.id, gameId }, session);
            await this.postActivityCompletion({
                activityId,
                gameId,
                playerId,
            }, session);
            await this.giveExperienceToPlayer({
                gameId,
                playerId,
                userId,
                experience: activity.experience,
            }, session);
            await this.positionPlayerOnLeaderboard({ gameId, playerId, experience: activity.experience }, session);
        });
    }
    async addCompletionToActivityHistory({ userId, activityId, completionDate }, session) {
        const newHistory = {
            user: userId,
            log: completionDate,
        };
        await this.activitiesRepository.updateHistory(activityId, newHistory, session);
    }
    async finishRequest({ requestId, gameId }, session) {
        await this.completeActivityRequestRepository.delete(requestId, gameId, session);
        await this.gamesRepository.updateRegisters(gameId, -1, session);
    }
    async postActivityCompletion({ activityId, gameId, playerId }, session) {
        await this.feedPostsRepository.create({
            game: gameId,
            player: playerId,
            activity: activityId,
            type: 'activity',
        }, session);
    }
    async giveExperienceToPlayer({ gameId, playerId, userId, experience }, session) {
        const [player, game] = await Promise.all([
            this.playersRepository.findById(playerId),
            this.gamesRepository.findOne(gameId),
        ]);
        player.experience += experience;
        const playerNextLevel = this.getNextLevel(game.levelInfo, player.experience);
        if (!playerNextLevel || playerNextLevel.level <= player.level)
            return await this.updatePlayer(player, session);
        player.level = playerNextLevel.level;
        await this.postNewLevel({ playerId, level: playerNextLevel, gameId }, session);
        const newRank = this.getNewRank(game.ranks, player.level);
        if (newRank) {
            player.rank = newRank;
            await this.postNewRank({ playerId, rank: newRank, gameId }, session);
        }
        return await this.updatePlayer(player, session);
    }
    getNextLevel(levelInfo, playerCurrentExperience) {
        const levelsSortedByHigherExperience = levelInfo.sort((a, b) => b.requiredExperience - a.requiredExperience);
        const nextObtainableLevel = levelsSortedByHigherExperience.find(level => level.requiredExperience <= playerCurrentExperience);
        return nextObtainableLevel;
    }
    getNewRank(gameRanks, playerLevel) {
        const obtainableRanks = gameRanks.filter(rank => rank.level <= playerLevel);
        const ranksSortedByHigherLevel = obtainableRanks.sort((a, b) => b.level - a.level);
        return ranksSortedByHigherLevel[0];
    }
    async postNewLevel({ playerId, level, gameId }, session) {
        await this.feedPostsRepository.create({
            player: playerId,
            type: 'level',
            level,
            game: gameId,
        }, session);
    }
    async postNewRank({ playerId, rank, gameId }, session) {
        await this.feedPostsRepository.create({
            player: playerId,
            type: 'rank',
            rank,
            game: gameId,
        }, session);
    }
    async updatePlayer(player, session) {
        await this.playersRepository.update({
            id: player.id,
            achievements: player.achievements,
            experience: player.experience,
            game: player.game,
            level: player.level,
            titles: player.titles,
            user: player.user,
            rank: player.rank,
        }, session);
    }
    async positionPlayerOnLeaderboard({ gameId, playerId, experience }, session) {
        let leaderboard = await this.leaderboardsRepository.getGameCurrentRanking(gameId);
        if (!leaderboard)
            leaderboard = await this.leaderboardsRepository.create({
                game: gameId,
                createdAt: new Date(),
                position: [],
            });
        await this.leaderboardsRepository.createOrUpdatePosition(leaderboard.id, playerId, experience, session);
    }
};
CompleteActivityService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('PlayersRepository')),
    __param(1, tsyringe_1.inject('ActivitiesRepository')),
    __param(2, tsyringe_1.inject('FeedPostsRepository')),
    __param(3, tsyringe_1.inject('CompleteActivityRequestRepository')),
    __param(4, tsyringe_1.inject('LeaderboardsRepository')),
    __param(5, tsyringe_1.inject('GamesRepository')),
    __param(6, tsyringe_1.inject('TransactionProvider')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object])
], CompleteActivityService);
exports.default = CompleteActivityService;
