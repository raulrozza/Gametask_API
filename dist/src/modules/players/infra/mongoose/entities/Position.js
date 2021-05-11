"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PositionSchema = new mongoose_1.Schema({
    player: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Player',
        required: true,
    },
    experiece: {
        type: Number,
        required: true,
    },
}, {
    _id: false,
});
exports.default = PositionSchema;
