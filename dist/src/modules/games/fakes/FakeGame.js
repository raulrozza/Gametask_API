"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = __importDefault(require("faker"));
const _1 = require(".");
class FakeGame {
    constructor() {
        this.id = '';
        this.name = faker_1.default.hacker.noun();
        this.description = faker_1.default.hacker.phrase();
        this.theme = new _1.FakeTheme();
        this.administrators = [];
        this.levelInfo = [];
        this.ranks = [];
        this.newRegisters = 0;
    }
}
exports.default = FakeGame;
