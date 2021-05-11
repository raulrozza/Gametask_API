"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ThemeSchema = new mongoose_1.default.Schema({
    primary: {
        type: String,
        required: true,
    },
    secondary: {
        type: String,
        required: true,
    },
}, {
    _id: false,
});
exports.default = ThemeSchema;
