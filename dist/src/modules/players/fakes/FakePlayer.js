"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = __importDefault(require("faker"));
class FakePlayer {
    constructor(user, game) {
        this.user = user;
        this.game = game;
        this.id = '';
        this.experience = faker_1.default.random.number(10000);
        this.level = faker_1.default.random.number(10);
        this.titles = [];
        this.achievements = [];
    }
}
exports.default = FakePlayer;
