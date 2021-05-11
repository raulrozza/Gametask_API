"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const FakeFeedPost_1 = __importDefault(require("../fakes/FakeFeedPost"));
const FakeFeedPostsRepository_1 = __importDefault(require("../repositories/fakes/FakeFeedPostsRepository"));
const ListFeedPostsService_1 = __importDefault(require("./ListFeedPostsService"));
describe('ListFeedPostsService', () => {
    it('should list both the posts from the game, and not the post from the other game', async () => {
        const feedPostsRepository = new FakeFeedPostsRepository_1.default();
        const listFeedPosts = new ListFeedPostsService_1.default(feedPostsRepository);
        const id = uuid_1.v4();
        const fakeFeedPost = new FakeFeedPost_1.default(id, id, 'activity');
        await feedPostsRepository.create(Object.assign({}, fakeFeedPost));
        await feedPostsRepository.create(Object.assign(Object.assign({}, fakeFeedPost), { game: 'another-game-id' }));
        await feedPostsRepository.create(Object.assign({}, fakeFeedPost));
        const posts = await listFeedPosts.execute(id);
        expect(posts).toHaveLength(2);
    });
});
