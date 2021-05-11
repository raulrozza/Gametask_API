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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const implementations_1 = require("@shared/errors/implementations");
const errorCodes_1 = __importDefault(require("@config/errorCodes"));
class FakeActivitiesRepository {
    constructor() {
        this.activities = [];
    }
    async findAllFromGame(gameId) {
        return Promise.resolve(this.activities.filter(activity => activity.game === gameId));
    }
    async findOne(id, gameId) {
        return Promise.resolve(this.activities.find(activity => activity.id === id && activity.game === gameId));
    }
    async create(activity) {
        activity.id = uuid_1.v4();
        this.activities.push(activity);
        return Promise.resolve(activity);
    }
    async delete(activityId, gameId) {
        const foundIndex = this.activities.findIndex(activity => activity.id === activityId && activity.game === gameId);
        this.activities.splice(foundIndex, 1);
    }
    async update(_a) {
        var { id, changelog } = _a, activity = __rest(_a, ["id", "changelog"]);
        const foundIndex = this.activities.findIndex(storedActivity => storedActivity.id === id && storedActivity.game === activity.game);
        if (foundIndex < 0)
            throw new implementations_1.RequestError('This activity does not exist', errorCodes_1.default.BAD_REQUEST_ERROR);
        const foundActivity = this.activities[foundIndex];
        const updatedActivity = Object.assign(Object.assign(Object.assign({}, foundActivity), activity), { changelog: [...changelog, ...foundActivity.changelog] });
        this.activities[foundIndex] = updatedActivity;
        return updatedActivity;
    }
    async updateHistory(id, history) {
        const foundIndex = this.activities.findIndex(storedActivity => storedActivity.id === id);
        if (foundIndex < 0)
            throw new implementations_1.RequestError('This activity does not exist', errorCodes_1.default.BAD_REQUEST_ERROR);
        const foundActivity = this.activities[foundIndex];
        foundActivity.history.unshift(history);
        this.activities[foundIndex] = foundActivity;
        return foundActivity;
    }
}
exports.default = FakeActivitiesRepository;
