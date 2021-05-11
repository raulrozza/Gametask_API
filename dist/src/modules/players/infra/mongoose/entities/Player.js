"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Rank_1 = __importDefault(require("@modules/games/infra/mongoose/entities/Rank"));
const PlayerSchema = new mongoose_1.Schema({
    experience: {
        type: Number,
        required: true,
        default: 0,
    },
    level: {
        type: Number,
        required: true,
        default: 0,
    },
    titles: {
        type: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Title',
            },
        ],
        default: [],
    },
    currentTitle: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Title',
    },
    rank: {
        type: Rank_1.default,
        default: null,
    },
    achievements: {
        type: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Achievement',
            },
        ],
        default: [],
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    game: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Game',
        required: true,
    },
}, {
    toJSON: {
        virtuals: true,
    },
});
exports.default = mongoose_1.model('Player', PlayerSchema);
