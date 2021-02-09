import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import { IActivitiesRepository } from '@modules/games/repositories';
import { IActivity } from '@modules/games/entities';

@injectable()
export default class ListActivitiesService {
  constructor(
    @inject('ActivitiesRepository')
    private activitiesRepository: IActivitiesRepository,
  ) {}

  public async execute(gameId: string): Promise<IActivity[]> {
    return await this.activitiesRepository.findAllFromGame(gameId);
  }
}
