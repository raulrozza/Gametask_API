import { ClientSession, isValidObjectId } from 'mongoose';

import errorCodes from '@config/errorCodes';
import { RequestError } from '@shared/infra/errors';
import { IUnlockAchievementRequestRepository } from '@modules/players/repositories';
import UnlockAchievementRequest, {
  IUnlockAchievementRequestDocument,
} from '@modules/players/infra/mongoose/entities/UnlockAchievementRequest';
import { IUnlockAchievementRequest } from '@modules/players/domain/entities';

export default class UnlockAchievementRequestRepository
  implements
    IUnlockAchievementRequestRepository<IUnlockAchievementRequestDocument> {
  public async checkIfRequested(
    requester: string,
    gameId: string,
    achievementId: string,
  ): Promise<boolean> {
    if (!isValidObjectId(requester))
      throw new RequestError('Requester is invalid!', errorCodes.INVALID_ID);

    if (!isValidObjectId(achievementId))
      throw new RequestError('Achievement is invalid!', errorCodes.INVALID_ID);

    const request = await UnlockAchievementRequest.findOne({
      game: gameId,
      achievement: achievementId,
      requester,
    });

    return Boolean(request);
  }

  public async findAllFromGame(
    gameId: string,
  ): Promise<IUnlockAchievementRequestDocument[]> {
    return UnlockAchievementRequest.find({ game: gameId })
      .populate({
        path: 'achievement',
        populate: {
          path: 'title',
        },
      })
      .populate({
        path: 'requester',
        populate: {
          path: 'user',
        },
      })
      .sort({ requestDate: -1 });
  }

  public async findOne(
    id: string,
  ): Promise<IUnlockAchievementRequestDocument | undefined> {
    if (!isValidObjectId(id))
      throw new RequestError('Id is invalid!', errorCodes.INVALID_ID);

    return await UnlockAchievementRequest.findById(id);
  }

  public async create(
    {
      requester,
      achievement,
      requestDate,
      information,
      game,
    }: Omit<IUnlockAchievementRequest, 'id'>,
    session?: ClientSession,
  ): Promise<IUnlockAchievementRequestDocument> {
    const [result] = await UnlockAchievementRequest.create(
      [
        {
          requester,
          achievement,
          requestDate,
          information,
          game,
        },
      ],
      { session },
    );

    return result;
  }

  public async delete(
    id: string,
    gameId: string,
    session?: ClientSession,
  ): Promise<void> {
    if (!isValidObjectId(id))
      throw new RequestError('Id is invalid!', errorCodes.INVALID_ID);

    await UnlockAchievementRequest.findOneAndDelete(
      {
        _id: id,
        game: gameId,
      },
      { session },
    );
  }
}
