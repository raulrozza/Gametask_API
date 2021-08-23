import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import { IActivitiesRepository } from '@modules/games/domain/repositories';
import { IActivity } from '@modules/games/domain/entities';

@injectable()
export default class ListActivitiesService {
  constructor(
    @inject('ActivitiesRepository')
    private activitiesRepository: IActivitiesRepository,
  ) {}

  public async execute(gameId: string): Promise<IActivity[]> {
    return this.activitiesRepository.findAllFromGame(gameId);
  }
}
