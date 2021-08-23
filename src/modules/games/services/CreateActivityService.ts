import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import { IActivitiesRepository } from '@modules/games/domain/repositories';
import { IActivity } from '@modules/games/domain/entities';
import ICreateActivityDTO from '@modules/games/domain/dtos/ICreateActivityDTO';
import CreateActivityAdapter from '@modules/games/domain/adapters/CreateActivity';

@injectable()
export default class CreateActivityService {
  constructor(
    @inject('ActivitiesRepository')
    private activitiesRepository: IActivitiesRepository,
  ) {}

  public async execute({
    gameId,
    name,
    experience,
    description,
    dmRules,
  }: ICreateActivityDTO): Promise<IActivity> {
    const activity = new CreateActivityAdapter({
      gameId,
      name,
      experience,
      description,
      dmRules,
    });

    return this.activitiesRepository.create(activity);
  }
}
