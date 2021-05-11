"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const environment_1 = __importDefault(require("@config/environment"));
const UserSchema = new mongoose_1.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: String,
    email: {
        type: String,
        required: true,
        unique: true,
        dropDups: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: String,
}, {
    toJSON: {
        virtuals: true,
    },
});
UserSchema.virtual('profile_url').get(function () {
    if (this.image)
        return `${environment_1.default.ADDRESS}/files/user/${this.image}`;
});
exports.default = mongoose_1.model('User', UserSchema);
