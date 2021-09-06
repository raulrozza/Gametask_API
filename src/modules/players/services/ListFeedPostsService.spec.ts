import { FakeFeedPost } from '@modules/players/domain/entities/fakes';
import { v4 as uuid } from 'uuid';

import FakeFeedPostsRepository from '@modules/players/domain/repositories/fakes/FakeFeedPostsRepository';
import ListFeedPostsService from './ListFeedPostsService';
import CreateFeedPostAdapter from '@modules/players/domain/adapters/CreateFeedPost';

describe('ListFeedPostsService', () => {
  it('should list both the posts from the game, and not the post from the other game', async () => {
    const feedPostsRepository = new FakeFeedPostsRepository();
    const listFeedPosts = new ListFeedPostsService(feedPostsRepository);

    const gameId = uuid();
    const fakeFeedPost = new FakeFeedPost();

    await feedPostsRepository.create(
      new CreateFeedPostAdapter({
        ...fakeFeedPost,
        player: fakeFeedPost.player.id,
        type: 'achievement',
        achievement: uuid(),
        activity: undefined,
        game: gameId,
      }),
    );
    await feedPostsRepository.create(
      new CreateFeedPostAdapter({
        ...fakeFeedPost,
        player: fakeFeedPost.player.id,
        type: 'achievement',
        achievement: uuid(),
        activity: undefined,
        game: 'another-game-id',
      }),
    );
    await feedPostsRepository.create(
      new CreateFeedPostAdapter({
        ...fakeFeedPost,
        player: fakeFeedPost.player.id,
        type: 'achievement',
        achievement: uuid(),
        activity: undefined,
        game: gameId,
      }),
    );

    const posts = await listFeedPosts.execute(gameId);

    expect(posts).toHaveLength(2);
  });
});
