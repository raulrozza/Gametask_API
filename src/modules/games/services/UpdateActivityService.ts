import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import errorCodes from '@config/errorCodes';
import { RequestError } from '@shared/errors/implementations';

import IUpdateActivityDTO from '@modules/games/dtos/IUpdateActivityDTO';
import { IActivity, IActivityLog } from '@modules/games/entities';
import { IActivitiesRepository } from '@modules/games/repositories';

interface INewActivityDTO {
  name: string;
  experience: number;
  description?: string;
  dmRules?: string;
}

@injectable()
export default class UpdateActivityService {
  private originalActivity: IActivity;

  constructor(
    @inject('ActivitiesRepository')
    private activitiesRepository: IActivitiesRepository,
  ) {
    this.originalActivity = {} as IActivity;
  }

  public async execute({
    gameId,
    userId,
    id,
    name,
    experience,
    description,
    dmRules,
  }: IUpdateActivityDTO): Promise<IActivity> {
    try {
      const foundActivity = await this.findOriginalActivity(id, gameId);

      if (!foundActivity)
        throw new RequestError(
          'This activity does not exist',
          errorCodes.RESOURCE_NOT_FOUND,
          400,
        );

      const newActivityLog = this.generateActivityLog(userId, {
        name,
        description,
        dmRules,
        experience,
      });

      const updatedActivity = await this.activitiesRepository.update({
        id: this.originalActivity.id,
        name,
        experience,
        description,
        dmRules,
        changelog: [newActivityLog],
        game: this.originalActivity.game,
        history: [],
      });

      return updatedActivity;
    } catch (error) {
      if (error instanceof RequestError) throw error;

      throw new RequestError(
        error.message,
        errorCodes.INTERNAL_SERVER_ERROR,
        500,
      );
    }
  }

  private async findOriginalActivity(
    activityId: string,
    gameId: string,
  ): Promise<boolean> {
    const activity = await this.activitiesRepository.findOne(
      activityId,
      gameId,
    );

    if (activity) this.originalActivity = activity;

    return Boolean(activity);
  }

  private generateActivityLog(
    userId: string,
    newActivity: INewActivityDTO,
  ): IActivityLog {
    const changes = this.getChanges(newActivity);

    const logVersion = this.originalActivity.changelog[0]
      ? this.originalActivity.changelog[0].version + 1
      : 1;

    const activityLog = {
      version: logVersion,
      log: new Date(),
      changes,
      userId,
    };

    return activityLog;
  }

  private getChanges(newActivity: INewActivityDTO): Partial<IActivity> {
    const changes: Partial<IActivity> = {};

    if (newActivity.name !== this.originalActivity.name)
      changes.name = newActivity.name;
    if (newActivity.description !== this.originalActivity.description)
      changes.description = newActivity.description;
    if (newActivity.experience !== this.originalActivity.experience)
      changes.experience = newActivity.experience;
    if (newActivity.dmRules !== this.originalActivity.dmRules)
      changes.dmRules = newActivity.dmRules;

    return changes;
  }
}
