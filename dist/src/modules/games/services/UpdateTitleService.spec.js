"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const implementations_1 = require("@shared/errors/implementations");
const uuid_1 = require("uuid");
const FakeTitle_1 = __importDefault(require("../fakes/FakeTitle"));
const FakeTitlesRepository_1 = __importDefault(require("../repositories/fakes/FakeTitlesRepository"));
const UpdateTitleService_1 = __importDefault(require("./UpdateTitleService"));
describe('UpdateTitleService', () => {
    it('should update the title correctly', async () => {
        const titlesRepository = new FakeTitlesRepository_1.default();
        const updateTitle = new UpdateTitleService_1.default(titlesRepository);
        const gameId = uuid_1.v4();
        const fakeTitle = new FakeTitle_1.default(gameId);
        const title = await titlesRepository.create(fakeTitle);
        const updatedTitle = await updateTitle.execute({
            id: title.id,
            name: 'Random name',
            gameId,
        });
        expect(updatedTitle).not.toEqual(title);
    });
    it('should throw when trying to update a non existing title', async () => {
        const titlesRepository = new FakeTitlesRepository_1.default();
        const updateTitle = new UpdateTitleService_1.default(titlesRepository);
        const gameId = uuid_1.v4();
        const fakeTitle = new FakeTitle_1.default(gameId);
        await expect(updateTitle.execute(Object.assign({ gameId }, fakeTitle))).rejects.toBeInstanceOf(implementations_1.RequestError);
    });
});
