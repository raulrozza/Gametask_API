"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const FakeActivity_1 = __importDefault(require("../fakes/FakeActivity"));
const FakeActivitiesRepository_1 = __importDefault(require("../repositories/fakes/FakeActivitiesRepository"));
const ListActivitiesService_1 = __importDefault(require("./ListActivitiesService"));
describe('ListActivitiesService', () => {
    it('should list only the activites of the selected game', async () => {
        const activitiesRepository = new FakeActivitiesRepository_1.default();
        const listActivities = new ListActivitiesService_1.default(activitiesRepository);
        const gameId = uuid_1.v4();
        const activity = new FakeActivity_1.default(gameId);
        await activitiesRepository.create({
            game: activity.game,
            name: activity.name,
            description: activity.description,
        });
        await activitiesRepository.create({
            game: activity.game,
            name: activity.name,
            description: activity.description,
        });
        await activitiesRepository.create({
            game: 'another_game_id',
            name: activity.name,
            description: activity.description,
        });
        const activities = await listActivities.execute(gameId);
        expect(activities).toHaveLength(2);
    });
});
