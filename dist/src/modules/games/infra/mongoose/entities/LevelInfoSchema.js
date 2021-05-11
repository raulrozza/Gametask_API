"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const LevelInfoSchema = new mongoose_1.default.Schema({
    level: {
        type: Number,
        required: true,
    },
    title: String,
    requiredExperience: {
        type: Number,
        required: true,
    },
}, {
    _id: false,
});
exports.default = LevelInfoSchema;
