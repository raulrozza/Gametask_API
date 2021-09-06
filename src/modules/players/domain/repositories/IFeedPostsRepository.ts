import CreateFeedPostAdapter from '@modules/players/domain/adapters/CreateFeedPost';
import { IFeedPost } from '@modules/players/domain/entities';

export default interface IFeedPostsRepository {
  findAllFromGame(gameId: string): Promise<IFeedPost[]>;
  create(feedPost: CreateFeedPostAdapter, session?: object): Promise<IFeedPost>;
}
