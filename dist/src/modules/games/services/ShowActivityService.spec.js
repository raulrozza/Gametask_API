"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const FakeActivity_1 = __importDefault(require("../fakes/FakeActivity"));
const FakeActivitiesRepository_1 = __importDefault(require("../repositories/fakes/FakeActivitiesRepository"));
const ShowActivityService_1 = __importDefault(require("./ShowActivityService"));
describe('ShowActivityService', () => {
    it('should return the correct activity', async () => {
        const activitiesRepository = new FakeActivitiesRepository_1.default();
        const showActivity = new ShowActivityService_1.default(activitiesRepository);
        const gameId = uuid_1.v4();
        const fakeActivity = new FakeActivity_1.default(gameId);
        const activity = await activitiesRepository.create({
            name: fakeActivity.name,
            description: fakeActivity.description,
            game: fakeActivity.game,
        });
        const fetchedActivity = await showActivity.execute({
            activityId: activity.id,
            gameId,
        });
        expect(fetchedActivity).toEqual(activity);
    });
    it('should return undefined when trying to fetch an activity while providing a wrong id', async () => {
        const activitiesRepository = new FakeActivitiesRepository_1.default();
        const showActivity = new ShowActivityService_1.default(activitiesRepository);
        const gameId = uuid_1.v4();
        const fakeActivity = new FakeActivity_1.default(gameId);
        const activity = await activitiesRepository.create({
            name: fakeActivity.name,
            description: fakeActivity.description,
            game: 'random-game-id',
        });
        const fetchedActivity = await showActivity.execute({
            activityId: activity.id,
            gameId,
        });
        expect(fetchedActivity).toBeUndefined();
    });
});
