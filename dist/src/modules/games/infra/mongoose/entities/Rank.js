"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const RankSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    tag: {
        type: String,
        required: true,
    },
    level: {
        type: Number,
        default: 0,
    },
    color: {
        type: String,
        default: 'transparent',
    },
}, {
    _id: false,
});
exports.default = RankSchema;
