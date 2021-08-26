import { IFeedPostsRepository } from '@modules/players/domain/repositories';
import { IFeedPost } from '@modules/players/domain/entities';
import CreateFeedPostAdapter from '@modules/players/domain/adapters/CreateFeedPost';
import { FakeFeedPost } from '@modules/players/domain/entities/fakes';

export default class FakeFeedPostsRepository implements IFeedPostsRepository {
  private feedPosts: IFeedPost[] = [];

  public async findAllFromGame(gameId: string): Promise<IFeedPost[]> {
    return this.feedPosts.filter(post => post.game === gameId);
  }

  public async create({
    date,
    game,
    player,
    achievement,
    activity,
    level,
    type,
    rank,
  }: CreateFeedPostAdapter): Promise<IFeedPost> {
    const newPost = new FakeFeedPost({
      game,
      player,
      type,
      date,
      achievement,
      activity,
      level,
      rank,
    });

    this.feedPosts.push(newPost);

    return newPost;
  }
}
