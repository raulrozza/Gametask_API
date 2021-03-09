import errorCodes from '@config/errorCodes';
import { ITitle } from '@modules/games/entities';
import { ITitlesRepository } from '@modules/games/repositories';
import { RequestError } from '@shared/errors/implementations';
import { isValidObjectId } from 'mongoose';
import Title, { ITitleDocument } from '../entities/Title';

export default class TitlesRepository
  implements ITitlesRepository<ITitleDocument> {
  public async findAllFromGame(
    gameId: string,
    name?: string,
  ): Promise<ITitleDocument[]> {
    if (!name) return await Title.find({ game: gameId });

    return Title.find({
      game: gameId,
      name: { $regex: `^${name}`, $options: 'i' },
    });
  }

  public async findOne(
    id: string,
    gameId: string,
  ): Promise<ITitleDocument | undefined> {
    if (!isValidObjectId(id))
      throw new RequestError('Id is invalid!', errorCodes.INVALID_ID);

    return Title.findOne({ _id: id, game: gameId });
  }

  public async create({
    name,
    game,
  }: Omit<ITitle, 'id'>): Promise<ITitleDocument> {
    return Title.create({ name, game });
  }

  public async delete(titleId: string, gameId: string): Promise<void> {
    if (!isValidObjectId(titleId))
      throw new RequestError('Id is invalid!', errorCodes.INVALID_ID);

    return Title.deleteOne({ _id: titleId, game: gameId });
  }

  public async update({ id, name }: ITitle): Promise<ITitle> {
    if (!isValidObjectId(id))
      throw new RequestError('Id is invalid!', errorCodes.INVALID_ID);

    return Title.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
        },
      },
      { new: true },
    );
  }
}
