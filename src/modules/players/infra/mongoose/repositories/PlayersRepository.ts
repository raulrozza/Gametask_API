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

  public async create(player: Omit<IPlayer, 'id'>): Promise<IPlayerDocument> {
    return await Player.create(player);
  }

  public async isThereAPlayerAssociatedWith(
    userId: string,
    gameId: string,
  ): Promise<boolean> {
    const player = await Player.findOne({ user: userId, game: gameId });

    return Boolean(player);
  }

  public async update({ id, ...player }: IPlayer): Promise<IPlayer> {
    const updatedPlayer = await Player.updateOne(
      { _id: id },
      { $set: player },
      { new: true },
    );

    return updatedPlayer;
  }
}
