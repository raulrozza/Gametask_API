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
class FakeAchievementsRepository {
    constructor() {
        this.achievements = [];
    }
    async findAllFromGame(gameId) {
        return Promise.resolve(this.achievements.filter(achievement => achievement.game === gameId));
    }
    async findOne(id, gameId) {
        return Promise.resolve(this.achievements.find(achievement => achievement.id === id && achievement.game === gameId));
    }
    async create(achievement) {
        achievement.id = uuid_1.v4();
        this.achievements.push(achievement);
        return Promise.resolve(achievement);
    }
    async delete(achievementId, gameId) {
        const foundIndex = this.achievements.findIndex(achievement => achievement.id === achievementId && achievement.game === gameId);
        this.achievements.splice(foundIndex, 1);
    }
    async update(_a) {
        var { id } = _a, achievement = __rest(_a, ["id"]);
        const foundIndex = this.achievements.findIndex(storedAchievement => storedAchievement.id === id &&
            storedAchievement.game === achievement.game);
        const foundAchievement = this.achievements[foundIndex];
        const updatedAchievement = Object.assign(Object.assign({}, foundAchievement), achievement);
        this.achievements[foundIndex] = updatedAchievement;
        return updatedAchievement;
    }
}
exports.default = FakeAchievementsRepository;
