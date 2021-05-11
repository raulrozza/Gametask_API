"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const FakeTitle_1 = __importDefault(require("../fakes/FakeTitle"));
const FakeTitlesRepository_1 = __importDefault(require("../repositories/fakes/FakeTitlesRepository"));
const ListTitlesService_1 = __importDefault(require("./ListTitlesService"));
describe('ListTitlesService', () => {
    it('should list only the titles in a of a given game', async () => {
        const titlesRepository = new FakeTitlesRepository_1.default();
        const listTitles = new ListTitlesService_1.default(titlesRepository);
        const gameId = uuid_1.v4();
        const fakeTitle = new FakeTitle_1.default(gameId);
        await titlesRepository.create({
            game: fakeTitle.game,
            name: fakeTitle.name,
        });
        await titlesRepository.create({
            game: fakeTitle.game,
            name: fakeTitle.name,
        });
        await titlesRepository.create({
            game: 'not-my-game-id',
            name: fakeTitle.name,
        });
        const titles = await listTitles.execute({ gameId });
        expect(titles).toHaveLength(2);
    });
    it('should list only the corresponding title', async () => {
        const titlesRepository = new FakeTitlesRepository_1.default();
        const listTitles = new ListTitlesService_1.default(titlesRepository);
        const gameId = uuid_1.v4();
        const fakeTitle1 = new FakeTitle_1.default(gameId);
        const fakeTitle2 = new FakeTitle_1.default(gameId);
        const title1 = await titlesRepository.create({
            game: fakeTitle1.game,
            name: fakeTitle1.name,
        });
        await titlesRepository.create({
            game: fakeTitle2.game,
            name: fakeTitle2.name,
        });
        const titles = await listTitles.execute({ gameId, name: title1.name });
        expect(titles).toHaveLength(1);
        expect(titles[0]).toEqual(title1);
    });
});
