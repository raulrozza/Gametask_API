"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const LevelInfoSchema_1 = __importDefault(require("@modules/games/infra/mongoose/entities/LevelInfoSchema"));
const Rank_1 = __importDefault(require("@modules/games/infra/mongoose/entities/Rank"));
const typeEnum = [
    'achievement',
    'activity',
    'level',
    'rank',
];
const FeedPostSchema = new mongoose_1.Schema({
    player: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Player',
        required: true,
    },
    type: {
        type: String,
        enum: typeEnum,
        required: true,
    },
    activity: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Activity',
        default: undefined,
    },
    achievement: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Achievement',
        default: undefined,
    },
    game: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Game',
        required: true,
    },
    level: {
        type: LevelInfoSchema_1.default,
        default: {
            level: 0,
            requiredExperience: 0,
        },
    },
    rank: {
        type: Rank_1.default,
        default: {
            name: ' ',
            tag: ' ',
        },
    },
    date: {
        type: Date,
        required: true,
    },
}, { toJSON: { virtuals: true } });
exports.default = mongoose_1.model('FeedPost', FeedPostSchema);
