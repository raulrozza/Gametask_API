import { ClientSession, isValidObjectId } from 'mongoose';

import errorCodes from '@config/errorCodes';
import { RequestError } from '@shared/infra/errors';
import { ICompleteActivityRequest } from '@modules/players/domain/entities';
import CompleteActivityRequest from '@modules/players/infra/mongoose/entities/CompleteActivityRequest';
import { ICompleteActivityRequestRepository } from '@modules/players/domain/repositories';
import CreateCompleteActivityRequestAdapter from '@modules/players/domain/adapters/CreateCompleteActivityRequest';

export default class CompleteActivityRequestRepository
  implements ICompleteActivityRequestRepository {
  public async findAllFromGame(
    gameId: string,
  ): Promise<ICompleteActivityRequest[]> {
    return CompleteActivityRequest.find({ game: gameId })
      .populate('activity')
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
  ): Promise<ICompleteActivityRequest | undefined> {
    if (!isValidObjectId(id))
      throw new RequestError('Id is invalid!', errorCodes.INVALID_ID);

    const request = await CompleteActivityRequest.findById(id)
      .populate('activity')
      .populate({
        path: 'requester',
        populate: {
          path: 'user',
        },
      });

    return request || undefined;
  }

  public async create(
    {
      requester,
      activity,
      requestDate,
      completionDate,
      information,
      game,
    }: CreateCompleteActivityRequestAdapter,
    session?: ClientSession,
  ): Promise<ICompleteActivityRequest> {
    const [result] = await CompleteActivityRequest.create(
      [
        {
          requester,
          activity,
          requestDate,
          completionDate,
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

    await CompleteActivityRequest.deleteOne(
      { _id: id, game: gameId },
      { session },
    );
  }
}
