"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Position_1 = __importDefault(require("@modules/players/infra/mongoose/entities/Position"));
const LeaderboardSchema = new mongoose_1.Schema({
    game: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Game',
        required: true,
    },
    position: {
        type: [Position_1.default],
        default: [],
    },
    createdAt: {
        type: Date,
        required: true,
    },
    expiresAt: Date,
}, {
    toJSON: {
        virtuals: true,
    },
});
exports.default = mongoose_1.model('Leaderboard', LeaderboardSchema);
