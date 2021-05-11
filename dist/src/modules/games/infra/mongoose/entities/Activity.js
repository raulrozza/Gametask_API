"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ActivityLog_1 = __importDefault(require("./ActivityLog"));
const History_1 = __importDefault(require("./History"));
const ActivitySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    description: String,
    experience: {
        type: Number,
        required: true,
    },
    dmRules: String,
    history: {
        type: [History_1.default],
        default: [],
    },
    changelog: {
        type: [ActivityLog_1.default],
        default: [],
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
exports.default = mongoose_1.model('Activity', ActivitySchema);
