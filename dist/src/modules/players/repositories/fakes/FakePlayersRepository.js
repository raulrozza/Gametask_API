"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
class FakePlayersRepository {
    constructor() {
        this.players = [];
    }
    async findAllFromUser(userId) {
        return Promise.resolve(this.players.filter(player => typeof player.user === 'string'
            ? player.user === userId
            : player.user.id === userId));
    }
    async findOne(id, userId, gameId) {
        const foundPlayer = this.players.find(player => player.id === id &&
            (typeof player.user === 'string'
                ? player.user === userId
                : player.user.id === userId) &&
            (typeof player.game === 'string'
                ? player.game === gameId
                : player.game.id === gameId));
        return Promise.resolve(foundPlayer);
    }
    async findById(id) {
        return this.players.find(player => player.id === id);
    }
    async create(player) {
        player.id = uuid_1.v4();
        this.players.push(player);
        return Promise.resolve(player);
    }
    async isThereAPlayerAssociatedWith(userId, gameId) {
        const player = this.players.find(player => (typeof player.user === 'string'
            ? player.user === userId
            : player.user.id === userId) &&
            (typeof player.game === 'string'
                ? player.game === gameId
                : player.game.id === gameId));
        return Boolean(player);
    }
    async update(_a) {
        var { id } = _a, player = __rest(_a, ["id"]);
        const foundIndex = this.players.findIndex(storedPlayer => storedPlayer.id === id);
        const foundPlayer = this.players[foundIndex];
        const updatedPlayer = Object.assign(Object.assign({}, foundPlayer), player);
        this.players[foundIndex] = updatedPlayer;
        return updatedPlayer;
    }
    async unlockAchievement(id, achievement, title) {
        const foundIndex = this.players.findIndex(storedPlayer => storedPlayer.id === id);
        const foundPlayer = this.players[foundIndex];
        foundPlayer.achievements.push(achievement);
        if (title)
            foundPlayer.titles.push(title);
        this.players[foundIndex] = foundPlayer;
        return foundPlayer;
    }
}
exports.default = FakePlayersRepository;
