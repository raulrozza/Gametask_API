"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Leaderboard_1 = __importDefault(require("@modules/players/infra/mongoose/entities/Leaderboard"));
const mongoose_1 = require("mongoose");
const implementations_1 = require("@shared/errors/implementations");
const errorCodes_1 = __importDefault(require("@config/errorCodes"));
class LeaderboardsRepository {
    async create({ game, createdAt, expiresAt, }) {
        return await Leaderboard_1.default.create({
            game,
            createdAt,
            expiresAt,
        });
    }
    async getGameCurrentRanking(gameId) {
        return await Leaderboard_1.default.findOne({ game: gameId }).populate({
            path: 'position',
            populate: {
                path: 'player',
                select: 'level rank currentTitle user id',
                populate: [
                    {
                        path: 'user',
                        select: 'id firstname lastname image profile_url',
                    },
                    {
                        path: 'currentTitle',
                    },
                ],
            },
        });
    }
    async createOrUpdatePosition(id, playerId, experience, session) {
        if (!mongoose_1.isValidObjectId(id))
            throw new implementations_1.RequestError('This leaderboard does not exist', errorCodes_1.default.BAD_REQUEST_ERROR);
        const leaderboard = (await Leaderboard_1.default.findById(id));
        const positions = [...leaderboard.position];
        const playerIndex = positions.findIndex(position => String(position.player) === String(playerId));
        if (playerIndex < 0) {
            positions.push({ player: playerId, experience });
            return Leaderboard_1.default.updateOne({
                _id: id,
            }, {
                $set: {
                    position: positions,
                },
            }, {
                session,
            });
        }
        positions[playerIndex].experience += experience;
        return await Leaderboard_1.default.updateOne({
            _id: id,
        }, {
            $set: {
                position: positions,
            },
        }, {
            session,
        });
    }
}
exports.default = LeaderboardsRepository;
