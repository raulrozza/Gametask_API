import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import { IActivitiesRepository } from '@shared/domain/repositories';
import ICreateActivityDTO from '@modules/games/domain/dtos/ICreateActivityDTO';
import { IActivity } from '@shared/domain/entities';
import CreateActivityAdapter from '@shared/domain/adapters/CreateActivity';

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
