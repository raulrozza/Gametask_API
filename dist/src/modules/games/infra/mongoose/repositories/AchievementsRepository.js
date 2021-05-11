"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const implementations_1 = require("@shared/errors/implementations");
const errorCodes_1 = __importDefault(require("@config/errorCodes"));
const Achievement_1 = __importDefault(require("@modules/games/infra/mongoose/entities/Achievement"));
class AchievementsRepository {
    async findAllFromGame(gameId) {
        return Achievement_1.default.find({ game: gameId }).populate('title');
    }
    async findOne(id, gameId) {
        if (!mongoose_1.isValidObjectId(id))
            throw new implementations_1.RequestError('Id is invalid!', errorCodes_1.default.INVALID_ID);
        return Achievement_1.default.findOne({
            _id: id,
            game: gameId,
        }).populate('title');
    }
    async create({ name, description, game, image, title, }) {
        return Achievement_1.default.create({
            name,
            description,
            game,
            image,
            title,
        });
    }
    async delete(achievementId, gameId) {
        if (!mongoose_1.isValidObjectId(achievementId))
            throw new implementations_1.RequestError('Id is invalid!', errorCodes_1.default.INVALID_ID);
        return Achievement_1.default.deleteOne({ _id: achievementId, game: gameId });
    }
    async update({ id, name, description, image, title, }) {
        if (!mongoose_1.isValidObjectId(id))
            throw new implementations_1.RequestError('Id is invalid!', errorCodes_1.default.INVALID_ID);
        return Achievement_1.default.findByIdAndUpdate(id, {
            $set: {
                name,
                description,
                image,
                title,
            },
        }, { new: true });
    }
}
exports.default = AchievementsRepository;
