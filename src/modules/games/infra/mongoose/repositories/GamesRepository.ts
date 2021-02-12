import { IGame } from '@modules/games/entities';
import { IGamesRepository } from '@modules/games/repositories';
import Game, { IGameDocument } from '../entities/Game';

export default class GamesRepository
  implements IGamesRepository<IGameDocument> {
  public async findAllFromUser(userId: string): Promise<IGameDocument[]> {
    const games = await Game.find({
      administrators: userId,
    });

    return games;
  }

  public async findOne(
    id: string,
    userId?: string,
  ): Promise<IGameDocument | undefined> {
    const game = userId
      ? await Game.findOne({ _id: id, administrators: userId })
      : await Game.findById(id);

    return game || undefined;
  }

  public async create(game: IGame): Promise<IGameDocument> {
    const createdGame = await Game.create(game);

    return createdGame;
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
    const updatedGame = await Game.findByIdAndUpdate(
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

    return updatedGame;
  }
}
