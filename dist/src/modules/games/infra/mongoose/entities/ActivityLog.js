"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ActivityLogSchema = new mongoose_1.default.Schema({
    version: {
        type: Number,
        required: true,
    },
    log: {
        type: Date,
        required: true,
    },
    changes: {
        type: Object,
        required: true,
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    _id: false,
});
exports.default = ActivityLogSchema;
