"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UnlockAchievementRequestSchema = new mongoose_1.Schema({
    requester: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Player',
        required: true,
    },
    achievement: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Achievement',
        required: true,
    },
    requestDate: {
        type: Date,
        required: true,
    },
    information: {
        type: String,
        required: false,
    },
    game: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Game',
        required: true,
    },
}, { toJSON: { virtuals: true } });
exports.default = mongoose_1.model('UnlockAchievementRequest', UnlockAchievementRequestSchema);
