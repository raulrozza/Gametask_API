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
let CreateCompleteActivityRequestService = class CreateCompleteActivityRequestService {
    constructor(completeActivityRequestRepository, gamesRepository, activitiesRepository, playersRepository, transactionProvider) {
        this.completeActivityRequestRepository = completeActivityRequestRepository;
        this.gamesRepository = gamesRepository;
        this.activitiesRepository = activitiesRepository;
        this.playersRepository = playersRepository;
        this.transactionProvider = transactionProvider;
    }
    async execute({ activity, gameId, userId, requester, completionDate, information, requestDate, }) {
        await this.validateInput({ activity, gameId, userId, requester });
        return await this.transactionProvider.startSession(async (session) => {
            const request = await this.completeActivityRequestRepository.create({
                activity,
                game: gameId,
                requester,
                completionDate,
                information,
                requestDate,
            }, session);
            await this.gamesRepository.updateRegisters(gameId, 1, session);
            return request;
        });
    }
    async validateInput({ activity, gameId, userId, requester, }) {
        const game = await this.gamesRepository.findOne(gameId);
        if (!game)
            throw new implementations_1.RequestError('This game does not exist', errorCodes_1.default.BAD_REQUEST_ERROR);
        const foundActivity = await this.activitiesRepository.findOne(activity, gameId);
        if (!foundActivity)
            throw new implementations_1.RequestError('This activity does not exist', errorCodes_1.default.BAD_REQUEST_ERROR);
        const player = await this.playersRepository.findOne(requester, userId, gameId);
        if (!player)
            throw new implementations_1.RequestError('This player does not exist', errorCodes_1.default.BAD_REQUEST_ERROR);
    }
};
CreateCompleteActivityRequestService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('CompleteActivityRequestRepository')),
    __param(1, tsyringe_1.inject('GamesRepository')),
    __param(2, tsyringe_1.inject('ActivitiesRepository')),
    __param(3, tsyringe_1.inject('PlayersRepository')),
    __param(4, tsyringe_1.inject('TransactionProvider')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], CreateCompleteActivityRequestService);
exports.default = CreateCompleteActivityRequestService;
