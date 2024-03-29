import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import { IActivitiesRepository } from '@shared/domain/repositories';
import ISelectActivityDTO from '@modules/games/domain/dtos/ISelectActivityDTO';

@injectable()
export default class DeleteActivityService {
  constructor(
    @inject('ActivitiesRepository')
    private activitiesRepository: IActivitiesRepository,
  ) {}

  public async execute({
    gameId,
    activityId,
  }: ISelectActivityDTO): Promise<void> {
    return this.activitiesRepository.delete(activityId, gameId);
  }
}
