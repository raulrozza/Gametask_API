import { ClientSession, isValidObjectId } from 'mongoose';

import errorCodes from '@config/errorCodes';
import { RequestError } from '@shared/infra/errors';
import UnlockAchievementRequest from '@modules/players/infra/mongoose/entities/UnlockAchievementRequest';
import { IUnlockAchievementRequest } from '@modules/players/domain/entities';
import { IUnlockAchievementRequestRepository } from '@modules/players/domain/repositories';
import { IFindOneAchievemementRequestParams } from '@modules/players/domain/repositories/IUnlockAchievementRequestRepository';
import CreateUnlockAchievementAdapter from '@modules/players/domain/adapters/CreateUnlockAchievement';

export default class UnlockAchievementRequestRepository
  implements IUnlockAchievementRequestRepository {
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
  ): Promise<IUnlockAchievementRequest[]> {
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

  public async findOne({
    id,
    gameId,
    requester,
    achievementId,
  }: IFindOneAchievemementRequestParams): Promise<
    IUnlockAchievementRequest | undefined
  > {
    if (id && !isValidObjectId(id))
      throw new RequestError('Id is invalid!', errorCodes.INVALID_ID);

    if (requester && !isValidObjectId(requester))
      throw new RequestError('Requester is invalid!', errorCodes.INVALID_ID);

    if (achievementId && !isValidObjectId(achievementId))
      throw new RequestError('Achievement is invalid!', errorCodes.INVALID_ID);

    const request = await UnlockAchievementRequest.findOne({
      _id: id,
      game: gameId,
      achievement: achievementId,
      requester,
    });

    return request || undefined;
  }

  public async create(
    {
      requester,
      achievement,
      requestDate,
      information,
      game,
    }: CreateUnlockAchievementAdapter,
    session?: ClientSession,
  ): Promise<IUnlockAchievementRequest> {
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
