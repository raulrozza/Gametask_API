"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const fakes_1 = require("../fakes");
const FakeActivitiesRepository_1 = __importDefault(require("../repositories/fakes/FakeActivitiesRepository"));
const DeleteActivityService_1 = __importDefault(require("./DeleteActivityService"));
describe('DeleteActivityService', () => {
    it('should delete the right achievement', async () => {
        const activitiesRepository = new FakeActivitiesRepository_1.default();
        const deleteActivity = new DeleteActivityService_1.default(activitiesRepository);
        const gameId = uuid_1.v4();
        const fakeActivity = new fakes_1.FakeActivity(gameId);
        await activitiesRepository.create({
            game: fakeActivity.game,
            name: fakeActivity.name,
            description: fakeActivity.description,
            experience: fakeActivity.experience,
        });
        const activityToBeDeleted = await activitiesRepository.create({
            game: fakeActivity.game,
            name: fakeActivity.name,
            description: fakeActivity.description,
            experience: fakeActivity.experience,
        });
        await activitiesRepository.create({
            game: fakeActivity.game,
            name: fakeActivity.name,
            description: fakeActivity.description,
            experience: fakeActivity.experience,
        });
        await deleteActivity.execute({
            gameId,
            activityId: activityToBeDeleted.id,
        });
        const activities = await activitiesRepository.findAllFromGame(gameId);
        expect(activities).toHaveLength(2);
        expect(activities).not.toContainEqual(activityToBeDeleted);
    });
});
