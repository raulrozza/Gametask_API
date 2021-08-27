import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { IActivitiesRepository } from '@shared/domain/repositories';
import ISelectActivityDTO from '@modules/games/domain/dtos/ISelectActivityDTO';

@injectable()
export default class ShowActivityService {
  constructor(
    @inject('ActivitiesRepository')
    private activitesRepository: IActivitiesRepository,
  ) {}

  public async execute({ gameId, activityId }: ISelectActivityDTO) {
    return this.activitesRepository.findOne(activityId, gameId);
  }
}
