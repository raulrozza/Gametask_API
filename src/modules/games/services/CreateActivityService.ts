import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import { IActivitiesRepository } from '@modules/games/repositories';
import { IActivity } from '@modules/games/entities';
import ICreateActivityDTO from '@modules/games/domain/dtos/ICreateActivityDTO';

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
    return this.activitiesRepository.create({
      name,
      experience,
      game: gameId,
      dmRules,
      description,
      changelog: [],
      history: [],
    });
  }
}
