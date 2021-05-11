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
class FakeGamesRepository {
    constructor() {
        this.games = [];
    }
    async findAllFromUser(userId) {
        return Promise.resolve(this.games.filter(game => game.administrators.includes(userId)));
    }
    async findOne(id, userId) {
        if (userId)
            return this.games.find(game => game.id === id && game.administrators.includes(userId));
        return this.games.find(game => game.id === id);
    }
    async create(game) {
        game.id = uuid_1.v4();
        this.games.push(game);
        return Promise.resolve(game);
    }
    async update(_a) {
        var { id } = _a, game = __rest(_a, ["id"]);
        const foundIndex = this.games.findIndex(storedGame => storedGame.id === id);
        const foundGame = this.games[foundIndex];
        const updatedGame = Object.assign(Object.assign({}, foundGame), game);
        this.games[foundIndex] = updatedGame;
        return updatedGame;
    }
    async updateRegisters(id, increase) {
        const foundIndex = this.games.findIndex(storedGame => storedGame.id === id);
        const foundGame = this.games[foundIndex];
        const updatedGame = Object.assign(Object.assign({}, foundGame), { newRegisters: Number(foundGame.newRegisters) + increase });
        this.games[foundIndex] = updatedGame;
        return updatedGame;
    }
}
exports.default = FakeGamesRepository;
