"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FakeLeaderboard {
    constructor(game) {
        this.game = game;
        this.id = '';
        this.position = [];
        this.createdAt = new Date();
    }
}
exports.default = FakeLeaderboard;
