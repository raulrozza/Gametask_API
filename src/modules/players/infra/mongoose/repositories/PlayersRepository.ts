import { ClientSession, isValidObjectId } from 'mongoose';

import errorCodes from '@config/errorCodes';
import { RequestError } from '@shared/infra/errors';
import Player from '@modules/players/infra/mongoose/entities/Player';
import { IPlayer } from '@modules/players/domain/entities';
import { IPlayersRepository } from '@modules/players/domain/repositories';
import { IFindOnePlayerParams } from '@modules/players/domain/repositories/IPlayersRepository';
import CreatePlayerAdapter from '@modules/players/domain/adapters/CreatePlayer';
import UpdatePlayerAdapter from '@modules/players/domain/adapters/UpdatePlayer';
import AddAchievementToPlayerAdapter from '@modules/players/domain/adapters/AddAchievementToPlayer';

export default class PlayersRepository implements IPlayersRepository {
  public async findAllFromUser(userId: string): Promise<IPlayer[]> {
    return Player.find({ user: userId })
      .populate('user', {
        firstname: 1,
        lastname: 1,
        image: 1,
        profile_url: 1,
      })
      .populate('game', {
        theme: 1,
        name: 1,
        description: 1,
        id: 1,
        image: 1,
        image_url: 1,
      });
  }

  public async findOne({
    id,
    userId,
    gameId,
  }: IFindOnePlayerParams): Promise<IPlayer | undefined> {
    if (!isValidObjectId(id))
      throw new RequestError('Id is invalid!', errorCodes.INVALID_ID);

    const params: { _id?: string; user?: string; game?: string } = {};
    if (id) params._id = id;
    if (userId) params.user = userId;
    if (gameId) params.game = gameId;

    const player = await Player.findOne(params)
      .populate('user', {
        firstname: 1,
        lastname: 1,
        image: 1,
        profile_url: 1,
      })
      .populate('game', {
        theme: 1,
        name: 1,
        description: 1,
        id: 1,
        image: 1,
        image_url: 1,
        levelInfo: 1,
      })
      .populate('titles')
      .populate('currentTitle');

    return player || undefined;
  }

  public async create({
    user,
    game,
    rank,
    level,
  }: CreatePlayerAdapter): Promise<IPlayer> {
    try {
      const player = await Player.create({
        user,
        game,
        rank,
        level,
      });

      return player;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async update(
    { id, experience, level, currentTitle, rank }: UpdatePlayerAdapter,
    session?: ClientSession,
  ): Promise<IPlayer> {
    if (!isValidObjectId(id))
      throw new RequestError('Id is invalid!', errorCodes.INVALID_ID);

    const player = await Player.findByIdAndUpdate(
      id,
      {
        $set: {
          experience,
          level,
          currentTitle,
          rank,
        },
      },
      { new: true, session },
    );

    if (!player)
      throw new RequestError(
        'Player could not be found',
        errorCodes.RESOURCE_NOT_FOUND,
      );

    return player;
  }

  public async addAchievement(
    { id, achievement, title }: AddAchievementToPlayerAdapter,
    session?: ClientSession,
  ): Promise<IPlayer> {
    if (!isValidObjectId(id))
      throw new RequestError('Id is invalid!', errorCodes.INVALID_ID);

    const pushDocument = title
      ? {
          achievements: achievement,
          titles: title,
        }
      : {
          achievements: achievement,
        };

    const player = await Player.findByIdAndUpdate(
      id,
      {
        $push: pushDocument,
      },
      { new: true, session },
    );

    if (!player)
      throw new RequestError(
        'Could not find player',
        errorCodes.RESOURCE_NOT_FOUND,
      );

    return player;
  }
}
