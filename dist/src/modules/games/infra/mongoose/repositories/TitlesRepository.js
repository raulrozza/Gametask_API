"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorCodes_1 = __importDefault(require("@config/errorCodes"));
const implementations_1 = require("@shared/errors/implementations");
const mongoose_1 = require("mongoose");
const Title_1 = __importDefault(require("../entities/Title"));
class TitlesRepository {
    async findAllFromGame(gameId, name) {
        if (!name)
            return await Title_1.default.find({ game: gameId });
        return Title_1.default.find({
            game: gameId,
            name: { $regex: `^${name}`, $options: 'i' },
        });
    }
    async findOne(id, gameId) {
        if (!mongoose_1.isValidObjectId(id))
            throw new implementations_1.RequestError('Id is invalid!', errorCodes_1.default.INVALID_ID);
        return Title_1.default.findOne({ _id: id, game: gameId });
    }
    async create({ name, game, }) {
        return Title_1.default.create({ name, game });
    }
    async delete(titleId, gameId) {
        if (!mongoose_1.isValidObjectId(titleId))
            throw new implementations_1.RequestError('Id is invalid!', errorCodes_1.default.INVALID_ID);
        return Title_1.default.deleteOne({ _id: titleId, game: gameId });
    }
    async update({ id, name }) {
        if (!mongoose_1.isValidObjectId(id))
            throw new implementations_1.RequestError('Id is invalid!', errorCodes_1.default.INVALID_ID);
        return Title_1.default.findByIdAndUpdate(id, {
            $set: {
                name,
            },
        }, { new: true });
    }
}
exports.default = TitlesRepository;
