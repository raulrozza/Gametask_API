import { IFeedPostsRepository } from '@modules/players/repositories';
import FeedPost, {
  IFeedPostDocument,
} from '@modules/players/infra/mongoose/entities/FeedPost';
import { ClientSession } from 'mongoose';
import { IFeedPost } from '@modules/players/domain/entities';

export default class FeedPostsRepository
  implements IFeedPostsRepository<IFeedPostDocument> {
  public async findAllFromGame(gameId: string): Promise<IFeedPostDocument[]> {
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
      .populate('activity', {
        name: 1,
        experience: 1,
      })
      .populate('achievement', {
        name: 1,
        title: 1,
      })
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
    }: Omit<IFeedPost, 'id' | 'date'>,
    session?: ClientSession,
  ): Promise<IFeedPostDocument> {
    const [result] = await FeedPost.create(
      [
        {
          player,
          type,
          game,
          date: new Date(),
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
