"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const errorCodes_1 = __importDefault(require("@config/errorCodes"));
const implementations_1 = require("@shared/errors/implementations");
const CompleteActivityRequest_1 = __importDefault(require("@modules/players/infra/mongoose/entities/CompleteActivityRequest"));
class CompleteActivityRequestRepository {
    async findAllFromGame(gameId) {
        return await CompleteActivityRequest_1.default.find({ game: gameId })
            .populate('activity')
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
        return await CompleteActivityRequest_1.default.findById(id);
    }
    async create({ requester, activity, requestDate, completionDate, information, game, }, session) {
        const [result] = await CompleteActivityRequest_1.default.create([
            {
                requester,
                activity,
                requestDate,
                completionDate,
                information,
                game,
            },
        ], { session });
        return result;
    }
    async delete(id, gameId, session) {
        if (!mongoose_1.isValidObjectId(id))
            throw new implementations_1.RequestError('Id is invalid!', errorCodes_1.default.INVALID_ID);
        await CompleteActivityRequest_1.default.deleteOne({ _id: id, game: gameId }, { session });
    }
}
exports.default = CompleteActivityRequestRepository;
