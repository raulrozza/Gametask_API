"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = __importDefault(require("faker"));
class FakeAchievement {
    constructor(game, title) {
        this.game = game;
        this.title = title;
        this.id = '';
        this.name = faker_1.default.lorem.word();
        this.description = faker_1.default.lorem.sentence();
    }
}
exports.default = FakeAchievement;
