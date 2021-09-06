import FeedPost from '@modules/players/infra/mongoose/entities/FeedPost';
import { ClientSession } from 'mongoose';
import { IFeedPost } from '@modules/players/domain/entities';
import { IFeedPostsRepository } from '@modules/players/domain/repositories';
import CreateFeedPostAdapter from '@modules/players/domain/adapters/CreateFeedPost';

export default class FeedPostsRepository implements IFeedPostsRepository {
  public async findAllFromGame(gameId: string): Promise<IFeedPost[]> {
    return FeedPost.find({ game: gameId })
      .populate({
        path: 'player',
        select: '_id level currentTitle rank',
        populate: [
          {
            path: 'user',
            select: 'firstname lastname image profile_url',
          },
          {
            path: 'currentTitle',
          },
        ],
      })
      .populate('activity')
      .populate('achievement')
      .sort({
        date: -1,
      });
  }

  public async create(
    {
      player,
      type,
      game,
      achievement,
      activity,
      level,
      rank,
      date,
    }: CreateFeedPostAdapter,
    session?: ClientSession,
  ): Promise<IFeedPost> {
    const [result] = await FeedPost.create(
      [
        {
          player,
          type,
          game,
          date,
          achievement,
          activity,
          level,
          rank,
        },
      ],
      { session },
    );

    return result;
  }
}
