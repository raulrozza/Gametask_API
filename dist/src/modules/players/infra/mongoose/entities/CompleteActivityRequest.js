"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CompleteActivityRequestSchema = new mongoose_1.Schema({
    requester: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Player',
        required: true,
    },
    activity: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Activity',
        required: true,
    },
    requestDate: {
        type: Date,
        required: true,
    },
    completionDate: {
        type: Date,
        required: true,
    },
    information: String,
    game: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Game',
        required: true,
    },
}, { toJSON: { virtuals: true } });
exports.default = mongoose_1.model('CompleteActivityRequest', CompleteActivityRequestSchema);
