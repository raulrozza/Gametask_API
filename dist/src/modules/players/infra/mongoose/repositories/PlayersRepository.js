"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const errorCodes_1 = __importDefault(require("@config/errorCodes"));
const implementations_1 = require("@shared/errors/implementations");
const Player_1 = __importDefault(require("@modules/players/infra/mongoose/entities/Player"));
class PlayersRepository {
    async findAllFromUser(userId) {
        return await Player_1.default.find({ user: userId })
            .populate('user', {
            firstname: 1,
            lastname: 1,
            image: 1,
            profile_url: 1,
        })
            .populate('game', {
            theme: 1,
            name: 1,
            description: 1,
            id: 1,
            image: 1,
            image_url: 1,
        });
    }
    async findOne(id, userId, gameId) {
        if (!mongoose_1.isValidObjectId(id))
            throw new implementations_1.RequestError('Id is invalid!', errorCodes_1.default.INVALID_ID);
        return await Player_1.default.findOne({
            _id: id,
            user: userId,
            game: gameId,
        })
            .populate('user', {
            firstname: 1,
            lastname: 1,
            image: 1,
            profile_url: 1,
        })
            .populate('game', {
            theme: 1,
            name: 1,
            description: 1,
            id: 1,
            image: 1,
            image_url: 1,
            levelInfo: 1,
        });
    }
    async findById(id) {
        if (!mongoose_1.isValidObjectId(id))
            throw new implementations_1.RequestError('Id is invalid!', errorCodes_1.default.INVALID_ID);
        return await Player_1.default.findOne({
            _id: id,
        })
            .populate('user', {
            firstname: 1,
            lastname: 1,
            image: 1,
            profile_url: 1,
        })
            .populate('game', {
            theme: 1,
            name: 1,
            description: 1,
            id: 1,
            image: 1,
            image_url: 1,
        });
    }
    async create({ user, game, rank, level, }) {
        return await Player_1.default.create({
            user,
            game,
            rank,
            level,
        });
    }
    async isThereAPlayerAssociatedWith(userId, gameId) {
        const player = await Player_1.default.findOne({ user: userId, game: gameId });
        return Boolean(player);
    }
    async update({ id, experience, level, achievements, currentTitle, rank }, session) {
        if (!mongoose_1.isValidObjectId(id))
            throw new implementations_1.RequestError('Id is invalid!', errorCodes_1.default.INVALID_ID);
        const updatedPlayer = await Player_1.default.findByIdAndUpdate(id, {
            $set: {
                experience,
                level,
                achievements,
                currentTitle,
                rank,
            },
        }, { new: true, session });
        return updatedPlayer;
    }
    async unlockAchievement(id, achievement, title, session) {
        if (!mongoose_1.isValidObjectId(id))
            throw new implementations_1.RequestError('Id is invalid!', errorCodes_1.default.INVALID_ID);
        if (title)
            return await Player_1.default.findByIdAndUpdate(id, {
                $push: {
                    achievements: achievement,
                    titles: title,
                },
            }, { new: true, session });
        return await Player_1.default.findByIdAndUpdate(id, {
            $push: {
                achievements: achievement,
            },
        }, { new: true, session });
    }
}
exports.default = PlayersRepository;
