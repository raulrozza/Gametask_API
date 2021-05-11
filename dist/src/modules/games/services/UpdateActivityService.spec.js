"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const implementations_1 = require("@shared/errors/implementations");
const uuid_1 = require("uuid");
const FakeActivity_1 = __importDefault(require("../fakes/FakeActivity"));
const FakeActivitiesRepository_1 = __importDefault(require("../repositories/fakes/FakeActivitiesRepository"));
const UpdateActivityService_1 = __importDefault(require("./UpdateActivityService"));
describe('UpdateActivityService', () => {
    it('should update the activity correctly, both the times', async () => {
        const activitiesRepository = new FakeActivitiesRepository_1.default();
        const updateActivity = new UpdateActivityService_1.default(activitiesRepository);
        const gameId = uuid_1.v4();
        const userId = uuid_1.v4();
        const fakeActivity = new FakeActivity_1.default(gameId);
        const activity = await activitiesRepository.create(fakeActivity);
        const updatedActivity = await updateActivity.execute({
            gameId,
            userId,
            id: activity.id,
            name: 'New name',
            description: 'New description',
            experience: fakeActivity.experience,
        });
        expect(updatedActivity).not.toEqual(activity);
        expect(updatedActivity.changelog).toHaveLength(1);
        const activityLog = updatedActivity.changelog[0];
        expect(activityLog.userId).toBe(userId);
        expect(activityLog.changes).toHaveProperty('name');
        expect(activityLog.changes).toHaveProperty('description');
        expect(activityLog.changes).not.toHaveProperty('experience');
        const newlyUpdatedActivity = await updateActivity.execute({
            gameId,
            userId,
            id: activity.id,
            name: updatedActivity.name,
            description: updatedActivity.description,
            experience: 10,
        });
        expect(newlyUpdatedActivity).not.toEqual(updatedActivity);
        expect(newlyUpdatedActivity.changelog).toHaveLength(2);
    });
    it('should throw when trying to update a non existing activity', async () => {
        const activitiesRepository = new FakeActivitiesRepository_1.default();
        const updateActivity = new UpdateActivityService_1.default(activitiesRepository);
        const gameId = uuid_1.v4();
        const userId = uuid_1.v4();
        const fakeActivity = new FakeActivity_1.default(gameId);
        await expect(updateActivity.execute(Object.assign(Object.assign({ gameId,
            userId }, fakeActivity), { id: 'invalid id' }))).rejects.toBeInstanceOf(implementations_1.RequestError);
    });
});
