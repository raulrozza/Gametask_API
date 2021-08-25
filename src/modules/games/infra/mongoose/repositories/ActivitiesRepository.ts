import { ClientSession, isValidObjectId } from 'mongoose';

import errorCodes from '@config/errorCodes';
import { RequestError } from '@shared/infra/errors';
import { IActivitiesRepository } from '@modules/games/domain/repositories';
import Activity from '@modules/games/infra/mongoose/entities/Activity';
import UpdateActivityAdapter from '@modules/games/domain/adapters/UpdateActivity';
import CreateActivityAdapter from '@modules/games/domain/adapters/CreateActivity';
import { IActivity, IHistory } from '@shared/domain/entities';

export default class ActivitiesRepository implements IActivitiesRepository {
  public async findAllFromGame(gameId: string): Promise<IActivity[]> {
    return Activity.find({ game: gameId })
      .populate('game')
      .populate('changelog.user')
      .populate('history.user');
  }

  public async findOne(
    id: string,
    gameId: string,
  ): Promise<IActivity | undefined> {
    if (!isValidObjectId(id))
      throw new RequestError('Id is invalid!', errorCodes.INVALID_ID);

    const activity = await Activity.findOne({
      _id: id,
      game: gameId,
    })
      .populate('game')
      .populate('changelog.user')
      .populate('history.user');

    return activity || undefined;
  }

  public async create({
    name,
    description,
    experience,
    dmRules,
    game,
  }: CreateActivityAdapter): Promise<IActivity> {
    return Activity.create({
      name,
      description,
      experience,
      dmRules,
      game,
    });
  }

  public async delete(activityId: string, gameId: string): Promise<void> {
    if (!isValidObjectId(activityId))
      throw new RequestError('Id is invalid!', errorCodes.INVALID_ID);

    return Activity.deleteOne({ _id: activityId, game: gameId });
  }

  public async update({
    id,
    changelog,
    name,
    description,
    dmRules,
    experience,
    game,
  }: UpdateActivityAdapter): Promise<IActivity> {
    if (!isValidObjectId(id))
      throw new RequestError('Id is invalid!', errorCodes.INVALID_ID);

    const activity = await Activity.findOneAndUpdate(
      { _id: id, game },
      {
        $set: {
          name,
          description,
          dmRules,
          experience,
        },
        $push: {
          changelog: {
            $each: changelog,
            $position: 0,
          },
        },
      },
      { new: true },
    )
      .populate('game')
      .populate('changelog.user')
      .populate('history.user');

    if (!activity)
      throw new RequestError(
        'Activity could not be found',
        errorCodes.RESOURCE_NOT_FOUND,
      );

    return activity || undefined;
  }

  public async updateHistory(
    id: string,
    history: IHistory,
    session?: ClientSession,
  ): Promise<IActivity> {
    if (!isValidObjectId(id))
      throw new RequestError('Id is invalid!', errorCodes.INVALID_ID);

    const activity = await Activity.findOneAndUpdate(
      { _id: id },
      {
        $push: {
          history: {
            $each: [history],
            $position: 0,
          },
        },
      },
      { new: true, session },
    )
      .populate('game')
      .populate('changelog.user')
      .populate('history.user');

    if (!activity)
      throw new RequestError(
        'Activity could not be found',
        errorCodes.RESOURCE_NOT_FOUND,
      );

    return activity;
  }
}
