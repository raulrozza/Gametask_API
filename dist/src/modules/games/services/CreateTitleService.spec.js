"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const FakeTitle_1 = __importDefault(require("../fakes/FakeTitle"));
const FakeTitlesRepository_1 = __importDefault(require("../repositories/fakes/FakeTitlesRepository"));
const CreateTitleService_1 = __importDefault(require("./CreateTitleService"));
describe('CreateTitleService', () => {
    it('should create the title', async () => {
        const titlesRepository = new FakeTitlesRepository_1.default();
        const createTitle = new CreateTitleService_1.default(titlesRepository);
        const gameId = uuid_1.v4();
        const fakeTitle = new FakeTitle_1.default(gameId);
        const payload = {
            name: fakeTitle.name,
            game: fakeTitle.game,
        };
        const title = await createTitle.execute(payload);
        expect(title).toHaveProperty('id');
        expect(title.name).toBe(fakeTitle.name);
        expect(title.game).toBe(fakeTitle.game);
    });
});
