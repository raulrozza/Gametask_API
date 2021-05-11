"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const implementations_1 = require("@shared/errors/implementations");
const errorCodes_1 = __importDefault(require("@config/errorCodes"));
class FakeLeaderboardsRepository {
    constructor() {
        this.leaderboards = [];
    }
    async create(leaderboard) {
        const id = uuid_1.v4();
        const newLeaderboard = Object.assign(Object.assign({}, leaderboard), { id });
        this.leaderboards.push(newLeaderboard);
        return newLeaderboard;
    }
    async getGameCurrentRanking(gameId) {
        return this.leaderboards.find(board => board.game === gameId);
    }
    async createOrUpdatePosition(id, playerId, experience) {
        const foundIndex = this.leaderboards.findIndex(board => board.id === id);
        if (foundIndex < 0)
            throw new implementations_1.RequestError('Leaderboard not found', errorCodes_1.default.BAD_REQUEST_ERROR);
        const foundLeaderboard = this.leaderboards[foundIndex];
        const playerPositionIndex = foundLeaderboard.position.findIndex(position => position.player === playerId);
        if (playerPositionIndex < 0) {
            foundLeaderboard.position.push({
                player: playerId,
                experience,
            });
            this.leaderboards[foundIndex] = foundLeaderboard;
            return foundLeaderboard;
        }
        const playerPosition = foundLeaderboard.position[playerPositionIndex];
        playerPosition.experience += experience;
        foundLeaderboard.position[playerPositionIndex] = playerPosition;
        this.leaderboards[foundIndex] = foundLeaderboard;
        return foundLeaderboard;
    }
}
exports.default = FakeLeaderboardsRepository;
