"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const environment_1 = __importDefault(require("@config/environment"));
const AchievementSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    title: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Title',
    },
    image: String,
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
AchievementSchema.virtual('image_url').get(function () {
    if (this.image)
        return `${environment_1.default.ADDRESS}/files/achievement/${this.image}`;
});
exports.default = mongoose_1.model('Achievement', AchievementSchema);
