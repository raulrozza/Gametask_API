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
let CreatePlayerService = class CreatePlayerService {
    constructor(playersRepository, gamesRepository, usersRepository) {
        this.playersRepository = playersRepository;
        this.gamesRepository = gamesRepository;
        this.usersRepository = usersRepository;
    }
    async execute({ userId, gameId }) {
        const [user, game] = await Promise.all([
            this.usersRepository.findOne(userId),
            this.gamesRepository.findOne(gameId),
        ]);
        if (!user || !game)
            throw new implementations_1.RequestError('Could not create player', errorCodes_1.default.BAD_REQUEST_ERROR);
        const playerAlreadyExists = await this.playersRepository.isThereAPlayerAssociatedWith(userId, gameId);
        if (playerAlreadyExists)
            throw new implementations_1.RequestError('User is already playing this game', errorCodes_1.default.PLAYER_ALREADY_EXISTS);
        const [initialRank, initialLevel] = await this.getInitialRankAndLevel(game);
        const player = await this.playersRepository.create({
            experience: 0,
            level: initialLevel,
            rank: initialRank,
            achievements: [],
            game: gameId,
            user: userId,
            titles: [],
        });
        return player;
    }
    async getInitialRankAndLevel(game) {
        const initialLevel = await this.getInitialLevel(game.levelInfo);
        const initialRank = await this.getInitialRank(game.ranks, initialLevel);
        return [initialRank, initialLevel];
    }
    async getInitialLevel(levelInfo) {
        const sortedLevels = levelInfo.sort((a, b) => a.requiredExperience - b.requiredExperience);
        const firstLevel = sortedLevels[0];
        if (!firstLevel)
            return 0;
        return firstLevel.level;
    }
    async getInitialRank(ranks, initialLevel) {
        if (!ranks.length)
            return;
        const sortedRanks = ranks.sort((a, b) => a.level - b.level);
        for (let i = 0; i < sortedRanks.length; i++) {
            const actualRank = sortedRanks[i];
            if (actualRank.level <= initialLevel)
                return actualRank;
        }
    }
};
CreatePlayerService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('PlayersRepository')),
    __param(1, tsyringe_1.inject('GamesRepository')),
    __param(2, tsyringe_1.inject('UsersRepository')),
    __metadata("design:paramtypes", [Object, Object, Object])
], CreatePlayerService);
exports.default = CreatePlayerService;
