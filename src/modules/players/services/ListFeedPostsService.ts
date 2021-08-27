import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import { IFeedPostsRepository } from '@modules/players/domain/repositories';

@injectable()
export default class ListFeedPostsService {
  constructor(
    @inject('FeedPostsRepository')
    private feedPostsRepository: IFeedPostsRepository,
  ) {}

  public async execute(gameId: string) {
    return this.feedPostsRepository.findAllFromGame(gameId);
  }
}
