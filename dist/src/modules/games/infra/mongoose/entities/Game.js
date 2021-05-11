"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const environment_1 = __importDefault(require("@config/environment"));
const Theme_1 = __importDefault(require("./Theme"));
const LevelInfoSchema_1 = __importDefault(require("./LevelInfoSchema"));
const Rank_1 = __importDefault(require("./Rank"));
const GameSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    theme: {
        type: Theme_1.default,
        default: {
            primary: '#FFFFFF',
            secondary: '#852c80',
        },
    },
    image: String,
    administrators: {
        type: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        default: [],
    },
    levelInfo: {
        type: [LevelInfoSchema_1.default],
        default: [
            {
                level: 0,
                requiredExperience: 0,
            },
        ],
    },
    newRegisters: {
        type: Number,
        default: 0,
    },
    ranks: {
        type: [Rank_1.default],
        default: [],
    },
}, {
    toJSON: {
        virtuals: true,
    },
});
GameSchema.virtual('image_url').get(function () {
    if (this.image)
        return `${environment_1.default.ADDRESS}/files/game/${this.image}`;
});
exports.default = mongoose_1.model('Game', GameSchema);
