import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { IActivitiesRepository } from '@modules/games/repositories';
import ISelectActivityDTO from '@modules/games/dtos/ISelectActivityDTO';

@injectable()
export default class ShowActivityService {
  constructor(
    @inject('ActivitiesRepository')
    private activitesRepository: IActivitiesRepository,
  ) {}

  public async execute({ gameId, activityId }: ISelectActivityDTO) {
    return await this.activitesRepository.findOne(activityId, gameId);
  }
}
