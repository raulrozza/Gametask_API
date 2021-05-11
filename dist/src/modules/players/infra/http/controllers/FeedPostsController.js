"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const services_1 = require("@modules/players/services");
class FeedPostsController {
    constructor() {
        this.index = async (request, response) => {
            const gameId = request.game;
            const listFeedPosts = tsyringe_1.container.resolve(services_1.ListFeedPostsService);
            const feedPosts = await listFeedPosts.execute(gameId);
            return response.json(feedPosts);
        };
    }
}
exports.default = FeedPostsController;
