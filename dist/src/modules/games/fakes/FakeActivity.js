"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = __importDefault(require("faker"));
class FakeActivity {
    constructor(game) {
        this.game = game;
        this.id = '';
        this.name = faker_1.default.lorem.word();
        this.experience = faker_1.default.random.number(1000);
        this.description = faker_1.default.lorem.sentence();
        this.dmRules = faker_1.default.lorem.sentence();
        this.changelog = [];
        this.history = [];
    }
}
exports.default = FakeActivity;
