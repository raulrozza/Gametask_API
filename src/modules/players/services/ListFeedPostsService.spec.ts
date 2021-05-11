import { v4 as uuid } from 'uuid';

import FakeFeedPost from '../fakes/FakeFeedPost';
import FakeFeedPostsRepository from '../repositories/fakes/FakeFeedPostsRepository';
import ListFeedPostsService from './ListFeedPostsService';

describe('ListFeedPostsService', () => {
  it('should list both the posts from the game, and not the post from the other game', async () => {
    const feedPostsRepository = new FakeFeedPostsRepository();
    const listFeedPosts = new ListFeedPostsService(feedPostsRepository);

    const id = uuid();
    const fakeFeedPost = new FakeFeedPost(id, id, 'activity');

    await feedPostsRepository.create({ ...fakeFeedPost });
    await feedPostsRepository.create({
      ...fakeFeedPost,
      game: 'another-game-id',
    });
    await feedPostsRepository.create({ ...fakeFeedPost });

    const posts = await listFeedPosts.execute(id);

    expect(posts).toHaveLength(2);
  });
});
