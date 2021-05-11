"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FakeFeedPost {
    constructor(player, game, type) {
        this.player = player;
        this.game = game;
        this.type = type;
        this.id = '';
        this.date = new Date();
    }
}
exports.default = FakeFeedPost;
