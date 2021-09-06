import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import { IActivitiesRepository } from '@shared/domain/repositories';
import { IActivity } from '@shared/domain/entities';

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
