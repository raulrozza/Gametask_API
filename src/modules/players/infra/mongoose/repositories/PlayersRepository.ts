import { isValidObjectId } from 'mongoose';

import errorCodes from '@config/errorCodes';
import { RequestError } from '@shared/errors/implementations';
import { IPlayersRepository } from '@modules/players/repositories';
import Player, {
  IPlayerDocument,
  IPlayerPopulatedDocument,
} from '@modules/players/infra/mongoose/entities/Player';
import { IPlayer } from '@modules/players/entities';

export default class PlayersRepository
  implements IPlayersRepository<IPlayerDocument | IPlayerPopulatedDocument> {
  public async findAllFromUser(
    userId: string,
  ): Promise<IPlayerPopulatedDocument[]> {
    return await Player.find({ user: userId }).populate('user', {
      firstname: 1,
      lastname: 1,
      image: 1,
      profile_url: 1,
    });
  }

  public async findOne(
    id: string,
    userId: string,
    gameId: string,
  ): Promise<IPlayerPopulatedDocument | undefined> {
    if (!isValidObjectId(id))
      throw new RequestError('Id is invalid!', errorCodes.INVALID_ID);

    return await Player.findOne({
      _id: id,
      user: userId,
      game: gameId,
    }).populate('user', {
      firstname: 1,
      lastname: 1,
      image: 1,
      profile_url: 1,
    });
  }

  public async create({
    user,
    game,
    rank,
    level,
  }: Omit<IPlayer, 'id'>): Promise<IPlayerDocument> {
    return await Player.create({
      user,
      game,
      rank,
      level,
    });
  }

  public async isThereAPlayerAssociatedWith(
    userId: string,
    gameId: string,
  ): Promise<boolean> {
    const player = await Player.findOne({ user: userId, game: gameId });

    return Boolean(player);
  }

  public async update({
    id,
    experience,
    level,
    achievements,
    currentTitle,
    rank,
  }: IPlayer): Promise<IPlayer> {
    if (!isValidObjectId(id))
      throw new RequestError('Id is invalid!', errorCodes.INVALID_ID);

    const updatedPlayer = await Player.findByIdAndUpdate(
      id,
      {
        $set: {
          experience,
          level,
          achievements,
          currentTitle,
          rank,
        },
      },
      { new: true },
    );

    return updatedPlayer;
  }

  public async unlockAchievement(
    id: string,
    achievement: string,
    title?: string,
  ): Promise<IPlayer> {
    if (!isValidObjectId(id))
      throw new RequestError('Id is invalid!', errorCodes.INVALID_ID);

    if (title)
      return await Player.findByIdAndUpdate(
        id,
        {
          $push: {
            achievements: achievement,
            titles: title,
          },
        },
        { new: true },
      );

    return await Player.findByIdAndUpdate(
      id,
      {
        $push: {
          achievements: achievement,
        },
      },
      { new: true },
    );
  }
}
