"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const fakes_1 = require("../fakes");
const FakeTitlesRepository_1 = __importDefault(require("../repositories/fakes/FakeTitlesRepository"));
const DeleteTitleService_1 = __importDefault(require("./DeleteTitleService"));
describe('DeleteTitleService', () => {
    it('should delete the right title', async () => {
        const titlesRepository = new FakeTitlesRepository_1.default();
        const deleteTitle = new DeleteTitleService_1.default(titlesRepository);
        const gameId = uuid_1.v4();
        const fakeTitle = new fakes_1.FakeTitle(gameId);
        await titlesRepository.create({
            game: fakeTitle.game,
            name: fakeTitle.name,
        });
        const titleToBeDeleted = await titlesRepository.create({
            game: fakeTitle.game,
            name: fakeTitle.name,
        });
        await titlesRepository.create({
            game: fakeTitle.game,
            name: fakeTitle.name,
        });
        await deleteTitle.execute({ gameId, titleId: titleToBeDeleted.id });
        const titles = await titlesRepository.findAllFromGame(gameId);
        expect(titles).toHaveLength(2);
        expect(titles).not.toContainEqual(titleToBeDeleted);
    });
});
