"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
class FakeFeedPostsRepository {
    constructor() {
        this.feedPosts = [];
    }
    async findAllFromGame(gameId) {
        return this.feedPosts.filter(post => post.game === gameId);
    }
    async create(feedPost) {
        const id = uuid_1.v4();
        const newPost = Object.assign(Object.assign({}, feedPost), { id, date: new Date() });
        this.feedPosts.push(newPost);
        return newPost;
    }
}
exports.default = FakeFeedPostsRepository;
