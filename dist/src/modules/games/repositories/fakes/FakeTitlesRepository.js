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
class FakeTitlesRepository {
    constructor() {
        this.titles = [];
    }
    async findAllFromGame(gameId, name) {
        return Promise.resolve(this.titles.filter(title => {
            if (!name)
                return title.game === gameId;
            return title.game === gameId && title.name.match(name);
        }));
    }
    async findOne(id, gameId) {
        return Promise.resolve(this.titles.find(title => title.id === id && title.game === gameId));
    }
    async create(title) {
        title.id = uuid_1.v4();
        this.titles.push(title);
        return Promise.resolve(title);
    }
    async delete(titleId, gameId) {
        const foundIndex = this.titles.findIndex(title => title.id === titleId && title.game === gameId);
        this.titles.splice(foundIndex, 1);
    }
    async update(_a) {
        var { id } = _a, title = __rest(_a, ["id"]);
        const foundIndex = this.titles.findIndex(storedTitle => storedTitle.id === id && storedTitle.game === title.game);
        const foundTitle = this.titles[foundIndex];
        const updatedTitle = Object.assign(Object.assign({}, foundTitle), title);
        this.titles[foundIndex] = updatedTitle;
        return updatedTitle;
    }
}
exports.default = FakeTitlesRepository;
