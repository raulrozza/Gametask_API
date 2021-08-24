import { ClientSession, isValidObjectId } from 'mongoose';

import errorCodes from '@config/errorCodes';
import { RequestError } from '@shared/infra/errors';
import { IGame } from '@modules/games/domain/entities';
import { IGamesRepository } from '@modules/games/domain/repositories';
import Game from '@modules/games/infra/mongoose/entities/Game';
import CreateGameAdapter from '@modules/games/domain/adapters/CreateGame';
import UpdateGameAdapter from '@modules/games/domain/adapters/UpdateGameAdapter';

export default class GamesRepository implements IGamesRepository {
  public async findAllFromUser(userId: string): Promise<IGame[]> {
    return Game.find({
      administrators: userId,
    });
  }

  public async findOne(
    id: string,
    userId?: string,
  ): Promise<IGame | undefined> {
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
  }: CreateGameAdapter): Promise<IGame> {
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
    levelInfo,
    ranks,
  }: UpdateGameAdapter): Promise<IGame> {
    if (!isValidObjectId(id))
      throw new RequestError('Id is invalid!', errorCodes.INVALID_ID);

    const game = await Game.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          name,
          description,
          theme,
          levelInfo,
          ranks,
        },
      },
      { new: true },
    );

    if (!game)
      throw new RequestError(
        'Game could not be found',
        errorCodes.RESOURCE_NOT_FOUND,
      );

    return game;
  }

  public async updateAvatar(id: string, image: string): Promise<IGame> {
    if (!isValidObjectId(id))
      throw new RequestError('Id is invalid!', errorCodes.INVALID_ID);

    const game = await Game.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          image,
        },
      },
      { new: true },
    );

    if (!game)
      throw new RequestError(
        'Game could not be found',
        errorCodes.RESOURCE_NOT_FOUND,
      );

    return game;
  }

  public async updateRegisters(
    id: string,
    increase: number,
    session?: ClientSession,
  ): Promise<IGame> {
    if (!isValidObjectId(id))
      throw new RequestError('Id is invalid!', errorCodes.INVALID_ID);

    const game = await Game.findByIdAndUpdate(
      id,
      {
        $inc: {
          newRegisters: increase,
        },
      },
      { new: true, session },
    );

    if (!game)
      throw new RequestError(
        'Game could not be found',
        errorCodes.RESOURCE_NOT_FOUND,
      );

    return game;
  }
}
