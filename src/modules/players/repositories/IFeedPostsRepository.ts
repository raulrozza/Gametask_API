import { IFeedPost } from '@modules/players/entities';

export default interface IFeedPostsRepository<T extends IFeedPost = IFeedPost> {
  findAllFromGame(gameId: string): Promise<T[]>;
  create(
    feedPost: Omit<IFeedPost, 'id' | 'date'>,
    session?: object,
  ): Promise<T>;
}
