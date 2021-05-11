"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const errorCodes_1 = __importDefault(require("@config/errorCodes"));
const implementations_1 = require("@shared/errors/implementations");
const Activity_1 = __importDefault(require("@modules/games/infra/mongoose/entities/Activity"));
class ActivitiesRepository {
    async findAllFromGame(gameId) {
        return Activity_1.default.find({ game: gameId });
    }
    async findOne(id, gameId) {
        if (!mongoose_1.isValidObjectId(id))
            throw new implementations_1.RequestError('Id is invalid!', errorCodes_1.default.INVALID_ID);
        return Activity_1.default.findOne({
            _id: id,
            game: gameId,
        });
    }
    async create({ name, description, experience, dmRules, game, }) {
        return Activity_1.default.create({
            name,
            description,
            experience,
            dmRules,
            game,
        });
    }
    async delete(activityId, gameId) {
        if (!mongoose_1.isValidObjectId(activityId))
            throw new implementations_1.RequestError('Id is invalid!', errorCodes_1.default.INVALID_ID);
        return Activity_1.default.deleteOne({ _id: activityId, game: gameId });
    }
    async update({ id, changelog, name, description, dmRules, experience, }) {
        if (!mongoose_1.isValidObjectId(id))
            throw new implementations_1.RequestError('Id is invalid!', errorCodes_1.default.INVALID_ID);
        return Activity_1.default.findByIdAndUpdate(id, {
            $set: {
                name,
                description,
                dmRules,
                experience,
            },
            $push: {
                changelog: {
                    $each: changelog,
                    $position: 0,
                },
            },
        }, { new: true });
    }
    async updateHistory(id, history, session) {
        if (!mongoose_1.isValidObjectId(id))
            throw new implementations_1.RequestError('Id is invalid!', errorCodes_1.default.INVALID_ID);
        return Activity_1.default.findByIdAndUpdate(id, {
            $push: {
                history: {
                    $each: [history],
                    $position: 0,
                },
            },
        }, { new: true, session });
    }
}
exports.default = ActivitiesRepository;
