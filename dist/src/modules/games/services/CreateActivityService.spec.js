"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const FakeActivity_1 = __importDefault(require("../fakes/FakeActivity"));
const FakeActivitiesRepository_1 = __importDefault(require("../repositories/fakes/FakeActivitiesRepository"));
const CreateActivityService_1 = __importDefault(require("./CreateActivityService"));
describe('CreateActivityService', () => {
    it('should create the activity', async () => {
        const activitiesRepository = new FakeActivitiesRepository_1.default();
        const createActivity = new CreateActivityService_1.default(activitiesRepository);
        const gameId = uuid_1.v4();
        const fakeActivity = new FakeActivity_1.default(gameId);
        const payload = {
            gameId,
            name: fakeActivity.name,
            description: fakeActivity.description,
            experience: fakeActivity.experience,
            dmRules: fakeActivity.dmRules,
        };
        const activity = await createActivity.execute(payload);
        expect(activity).toHaveProperty('id');
        expect(activity.name).toBe(fakeActivity.name);
        expect(activity.description).toBe(fakeActivity.description);
        expect(activity.experience).toBe(fakeActivity.experience);
        expect(activity.dmRules).toBe(fakeActivity.dmRules);
    });
});
