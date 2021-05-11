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
let DeleteCompleteActivityRequestService = class DeleteCompleteActivityRequestService {
    constructor(completeActivityRequestRepository, gamesRepository, transactionProvider) {
        this.completeActivityRequestRepository = completeActivityRequestRepository;
        this.gamesRepository = gamesRepository;
        this.transactionProvider = transactionProvider;
    }
    async execute({ gameId, requestId, }) {
        const game = await this.gamesRepository.findOne(gameId);
        if (!game)
            throw new implementations_1.RequestError('Game does not exist', errorCodes_1.default.BAD_REQUEST_ERROR);
        const requestExists = await this.completeActivityRequestRepository.findOne(requestId);
        if (!requestExists)
            throw new implementations_1.RequestError('This request does not exist', errorCodes_1.default.BAD_REQUEST_ERROR);
        await this.transactionProvider.startSession(async (session) => {
            await this.completeActivityRequestRepository.delete(requestId, gameId, session);
            await this.gamesRepository.updateRegisters(game.id, -1, session);
        });
    }
};
DeleteCompleteActivityRequestService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('CompleteActivityRequestRepository')),
    __param(1, tsyringe_1.inject('GamesRepository')),
    __param(2, tsyringe_1.inject('TransactionProvider')),
    __metadata("design:paramtypes", [Object, Object, Object])
], DeleteCompleteActivityRequestService);
exports.default = DeleteCompleteActivityRequestService;
