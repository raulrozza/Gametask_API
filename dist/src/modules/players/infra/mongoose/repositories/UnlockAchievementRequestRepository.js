"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const errorCodes_1 = __importDefault(require("@config/errorCodes"));
const implementations_1 = require("@shared/errors/implementations");
const UnlockAchievementRequest_1 = __importDefault(require("@modules/players/infra/mongoose/entities/UnlockAchievementRequest"));
class UnlockAchievementRequestRepository {
    async checkIfRequested(requester, gameId, achievementId) {
        if (!mongoose_1.isValidObjectId(requester))
            throw new implementations_1.RequestError('Requester is invalid!', errorCodes_1.default.INVALID_ID);
        if (!mongoose_1.isValidObjectId(achievementId))
            throw new implementations_1.RequestError('Achievement is invalid!', errorCodes_1.default.INVALID_ID);
        const request = await UnlockAchievementRequest_1.default.findOne({
            game: gameId,
            achievement: achievementId,
            requester,
        });
        return Boolean(request);
    }
    async findAllFromGame(gameId) {
        return UnlockAchievementRequest_1.default.find({ game: gameId })
            .populate({
            path: 'achievement',
            populate: {
                path: 'title',
            },
        })
            .populate({
            path: 'requester',
            populate: {
                path: 'user',
            },
        })
            .sort({ requestDate: -1 });
    }
    async findOne(id) {
        if (!mongoose_1.isValidObjectId(id))
            throw new implementations_1.RequestError('Id is invalid!', errorCodes_1.default.INVALID_ID);
        return await UnlockAchievementRequest_1.default.findById(id);
    }
    async create({ requester, achievement, requestDate, information, game, }, session) {
        const [result] = await UnlockAchievementRequest_1.default.create([
            {
                requester,
                achievement,
                requestDate,
                information,
                game,
            },
        ], { session });
        return result;
    }
    async delete(id, gameId, session) {
        if (!mongoose_1.isValidObjectId(id))
            throw new implementations_1.RequestError('Id is invalid!', errorCodes_1.default.INVALID_ID);
        await UnlockAchievementRequest_1.default.findOneAndDelete({
            _id: id,
            game: gameId,
        }, { session });
    }
}
exports.default = UnlockAchievementRequestRepository;
