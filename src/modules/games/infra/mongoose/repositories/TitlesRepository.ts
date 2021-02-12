import { ITitle } from '@modules/games/entities';
import { ITitlesRepository } from '@modules/games/repositories';
import Title, { ITitleDocument } from '../entities/Title';

export default class TitlesRepository
  implements ITitlesRepository<ITitleDocument> {
  public async findAllFromGame(
    gameId: string,
    name?: string,
  ): Promise<ITitleDocument[]> {
    if (!name) return await Title.find({ game: gameId });

    return await Title.find({
      game: gameId,
      name: { $regex: `^${name}`, $options: 'i' },
    });
  }

  public async findOne(
    id: string,
    gameId: string,
  ): Promise<ITitleDocument | undefined> {
    return await Title.findOne({ _id: id, game: gameId });
  }

  public async create(title: Omit<ITitle, 'id'>): Promise<ITitleDocument> {
    return await Title.create(title);
  }

  public async delete(titleId: string, gameId: string): Promise<void> {
    await Title.deleteOne({ _id: titleId, game: gameId });
  }

  public async update({ id, name }: ITitle): Promise<ITitle> {
    const updatedTitle = await Title.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
        },
      },
      { new: true },
    );

    return updatedTitle;
  }
}
