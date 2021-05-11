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
const FakeCompleteActivityRequest_1 = __importDefault(require("../fakes/FakeCompleteActivityRequest"));
const FakeCompleteActivityRequestRepository_1 = __importDefault(require("../repositories/fakes/FakeCompleteActivityRequestRepository"));
const ListCompleteActivityRequestsService_1 = __importDefault(require("./ListCompleteActivityRequestsService"));
describe('ListCompleteActivityRequestsService', () => {
    it('should list both the activity requests from the game', async () => {
        const completeActivityRequestRepository = new FakeCompleteActivityRequestRepository_1.default();
        const listCompleteActivityRequests = new ListCompleteActivityRequestsService_1.default(completeActivityRequestRepository);
        const playerId = uuid_1.v4();
        const gameId = uuid_1.v4();
        const activityId = uuid_1.v4();
        const _a = new FakeCompleteActivityRequest_1.default(playerId, activityId, gameId), { id: _ } = _a, fakeRequest = __rest(_a, ["id"]);
        await completeActivityRequestRepository.create(Object.assign({}, fakeRequest));
        await completeActivityRequestRepository.create(Object.assign(Object.assign({}, fakeRequest), { game: 'another-game' }));
        await completeActivityRequestRepository.create(Object.assign(Object.assign({}, fakeRequest), { activity: 'another-achievement' }));
        const requests = await listCompleteActivityRequests.execute(gameId);
        expect(requests).toHaveLength(2);
    });
});
