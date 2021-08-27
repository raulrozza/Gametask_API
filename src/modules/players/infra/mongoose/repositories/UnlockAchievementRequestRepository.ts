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

    const params: {
      _id?: string;
      game?: string;
      achievement?: string;
      requester?: string;
    } = {};
    if (id) params._id = id;
    if (gameId) params.game = gameId;
    if (achievementId) params.achievement = achievementId;
    if (requester) params.requester = requester;

    const request = await UnlockAchievementRequest.findOne(params);

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
