"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = __importDefault(require("faker"));
class FakeUnlockAchievementRequest {
    constructor(game, requester, achievement) {
        this.game = game;
        this.requester = requester;
        this.achievement = achievement;
        this.id = '';
        this.requestDate = new Date();
        this.information = faker_1.default.random.words();
    }
}
exports.default = FakeUnlockAchievementRequest;
