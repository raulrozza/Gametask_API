import { ClientSession, isValidObjectId } from 'mongoose';

import errorCodes from '@config/errorCodes';
import { RequestError } from '@shared/errors/implementations';
import { ICompleteActivityRequestRepository } from '@modules/players/repositories';
import { ICompleteActivityRequest } from '@modules/players/entities';
import CompleteActivityRequest, {
  ICompleteActivityRequestDocument,
} from '@modules/players/infra/mongoose/entities/CompleteActivityRequest';

export default class CompleteActivityRequestRepository
  implements
    ICompleteActivityRequestRepository<ICompleteActivityRequestDocument> {
  public async findAllFromGame(
    gameId: string,
  ): Promise<ICompleteActivityRequestDocument[]> {
    return await CompleteActivityRequest.find({ game: gameId })
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
  ): Promise<ICompleteActivityRequestDocument | undefined> {
    if (!isValidObjectId(id))
      throw new RequestError('Id is invalid!', errorCodes.INVALID_ID);

    return await CompleteActivityRequest.findById(id);
  }

  public async create(
    {
      requester,
      activity,
      requestDate,
      completionDate,
      information,
      game,
    }: Omit<ICompleteActivityRequest, 'id'>,
    session?: ClientSession,
  ): Promise<ICompleteActivityRequestDocument> {
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
