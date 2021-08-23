import { ClientSession, isValidObjectId } from 'mongoose';

import errorCodes from '@config/errorCodes';
import { RequestError } from '@shared/infra/errors';
import { IGame } from '@modules/games/domain/entities';
import { IGamesRepository } from '@modules/games/domain/repositories';
import Game, {
  IGameDocument,
} from '@modules/games/infra/mongoose/entities/Game';

export default class GamesRepository
  implements IGamesRepository<IGameDocument> {
  public async findAllFromUser(userId: string): Promise<IGameDocument[]> {
    return Game.find({
      administrators: userId,
    });
  }

  public async findOne(
    id: string,
    userId?: string,
  ): Promise<IGameDocument | undefined> {
    if (!isValidObjectId(id))
      throw new RequestError('Id is invalid!', errorCodes.INVALID_ID);

    const game = userId
      ? await Game.findOne({ _id: id, administrators: userId })
      : await Game.findById(id);

    return game || undefined;
  }

  public async create({
    name,
    description,
    administrators,
  }: IGame): Promise<IGameDocument> {
    return Game.create({
      name,
      description,
      administrators,
    });
  }

  public async update({
    id,
    name,
    description,
    theme,
    image,
    newRegisters,
    levelInfo,
    administrators,
    ranks,
  }: IGame): Promise<IGameDocument> {
    if (!isValidObjectId(id))
      throw new RequestError('Id is invalid!', errorCodes.INVALID_ID);

    return Game.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          description,
          theme,
          image,
          newRegisters,
          levelInfo,
          ranks,
          administrators,
        },
      },
      { new: true },
    );
  }

  public async updateRegisters(
    id: string,
    increase: number,
    session?: ClientSession,
  ): Promise<IGameDocument> {
    if (!isValidObjectId(id))
      throw new RequestError('Id is invalid!', errorCodes.INVALID_ID);

    return Game.findByIdAndUpdate(
      id,
      {
        $inc: {
          newRegisters: increase,
        },
      },
      { new: true, session },
    );
  }
}
