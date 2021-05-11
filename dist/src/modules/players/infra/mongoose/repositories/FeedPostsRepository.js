"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FeedPost_1 = __importDefault(require("@modules/players/infra/mongoose/entities/FeedPost"));
class FeedPostsRepository {
    async findAllFromGame(gameId) {
        return FeedPost_1.default.find({ game: gameId })
            .populate({
            path: 'player',
            select: '_id level currentTitle rank',
            populate: [
                {
                    path: 'user',
                    select: 'firstname lastname image profile_url',
                },
                {
                    path: 'currentTitle',
                },
            ],
        })
            .populate('activity', {
            name: 1,
            experience: 1,
        })
            .populate('achievement', {
            name: 1,
            title: 1,
        })
            .sort({
            date: -1,
        });
    }
    async create({ player, type, game, achievement, activity, level, rank, }, session) {
        const [result] = await FeedPost_1.default.create([
            {
                player,
                type,
                game,
                date: new Date(),
                achievement,
                activity,
                level,
                rank,
            },
        ], { session });
        return result;
    }
}
exports.default = FeedPostsRepository;
