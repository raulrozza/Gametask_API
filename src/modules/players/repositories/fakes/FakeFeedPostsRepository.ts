import { v4 as uuid } from 'uuid';

import { IFeedPost } from '@modules/players/entities';
import { IFeedPostsRepository } from '@modules/players/repositories';

export default class FakeFeedPostsRepository
  implements IFeedPostsRepository<IFeedPost> {
  private feedPosts: IFeedPost[] = [];

  public async findAllFromGame(gameId: string): Promise<IFeedPost[]> {
    return this.feedPosts.filter(post => post.game === gameId);
  }

  public async create(
    feedPost: Omit<IFeedPost, 'id' | 'date'>,
  ): Promise<IFeedPost> {
    const id = uuid();
    const newPost = {
      ...feedPost,
      id,
      date: new Date(),
    };

    this.feedPosts.push(newPost);

    return newPost;
  }
}
