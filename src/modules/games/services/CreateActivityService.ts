import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import { IActivitiesRepository } from '@modules/games/domain/repositories';
import ICreateActivityDTO from '@modules/games/domain/dtos/ICreateActivityDTO';
import CreateActivityAdapter from '@modules/games/domain/adapters/CreateActivity';
import { IActivity } from '@shared/domain/entities';

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
    return this.activitiesRepository.create(
      new CreateActivityAdapter({
        gameId,
        name,
        experience,
        description,
        dmRules,
      }),
    );
  }
}
