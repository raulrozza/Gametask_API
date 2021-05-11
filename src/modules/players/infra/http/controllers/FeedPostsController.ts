import { RequestHandler } from 'express';
import { container } from 'tsyringe';

import { ListFeedPostsService } from '@modules/players/services';

export default class FeedPostsController {
  public index: RequestHandler = async (request, response) => {
    const gameId = request.game;

    const listFeedPosts = container.resolve(ListFeedPostsService);

    const feedPosts = await listFeedPosts.execute(gameId);

    return response.json(feedPosts);
  };
}
