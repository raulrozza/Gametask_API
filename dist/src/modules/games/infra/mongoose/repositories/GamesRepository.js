"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const errorCodes_1 = __importDefault(require("@config/errorCodes"));
const implementations_1 = require("@shared/errors/implementations");
const Game_1 = __importDefault(require("@modules/games/infra/mongoose/entities/Game"));
class GamesRepository {
    async findAllFromUser(userId) {
        return Game_1.default.find({
            administrators: userId,
        });
    }
    async findOne(id, userId) {
        if (!mongoose_1.isValidObjectId(id))
            throw new implementations_1.RequestError('Id is invalid!', errorCodes_1.default.INVALID_ID);
        const game = userId
            ? await Game_1.default.findOne({ _id: id, administrators: userId })
            : await Game_1.default.findById(id);
        return game || undefined;
    }
    async create({ name, description, administrators, }) {
        return Game_1.default.create({
            name,
            description,
            administrators,
        });
    }
    async update({ id, name, description, theme, image, newRegisters, levelInfo, administrators, ranks, }) {
        if (!mongoose_1.isValidObjectId(id))
            throw new implementations_1.RequestError('Id is invalid!', errorCodes_1.default.INVALID_ID);
        return Game_1.default.findByIdAndUpdate(id, {
            $set: {
                name,
                description,
                theme,
                image,
                newRegisters,
                levelInfo,
                ranks,
                administrators,
            },
        }, { new: true });
    }
    async updateRegisters(id, increase, session) {
        if (!mongoose_1.isValidObjectId(id))
            throw new implementations_1.RequestError('Id is invalid!', errorCodes_1.default.INVALID_ID);
        return Game_1.default.findByIdAndUpdate(id, {
            $inc: {
                newRegisters: increase,
            },
        }, { new: true, session });
    }
}
exports.default = GamesRepository;
