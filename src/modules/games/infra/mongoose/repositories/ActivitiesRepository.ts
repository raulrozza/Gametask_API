import { ClientSession, isValidObjectId } from 'mongoose';

import errorCodes from '@config/errorCodes';
import { RequestError } from '@shared/infra/errors';
import { IActivitiesRepository } from '@modules/games/domain/repositories';
import { IActivity, IHistory } from '@modules/games/domain/entities';
import Activity, {
  IActivityDocument,
} from '@modules/games/infra/mongoose/entities/Activity';

export default class ActivitiesRepository
  implements IActivitiesRepository<IActivityDocument> {
  public async findAllFromGame(gameId: string): Promise<IActivityDocument[]> {
    return Activity.find({ game: gameId });
  }

  public async findOne(
    id: string,
    gameId: string,
  ): Promise<IActivityDocument | undefined> {
    if (!isValidObjectId(id))
      throw new RequestError('Id is invalid!', errorCodes.INVALID_ID);

    return Activity.findOne({
      _id: id,
      game: gameId,
    });
  }

  public async create({
    name,
    description,
    experience,
    dmRules,
    game,
  }: Omit<IActivity, 'id'>): Promise<IActivityDocument> {
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
  }: IActivity): Promise<IActivity> {
    if (!isValidObjectId(id))
      throw new RequestError('Id is invalid!', errorCodes.INVALID_ID);

    return Activity.findByIdAndUpdate(
      id,
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
    );
  }

  public async updateHistory(
    id: string,
    history: IHistory,
    session?: ClientSession,
  ): Promise<IActivityDocument> {
    if (!isValidObjectId(id))
      throw new RequestError('Id is invalid!', errorCodes.INVALID_ID);

    return Activity.findByIdAndUpdate(
      id,
      {
        $push: {
          history: {
            $each: [history],
            $position: 0,
          },
        },
      },
      { new: true, session },
    );
  }
}
