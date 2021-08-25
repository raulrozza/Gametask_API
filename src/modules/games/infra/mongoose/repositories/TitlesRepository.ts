import errorCodes from '@config/errorCodes';
import { ITitlesRepository } from '@modules/games/domain/repositories';
import { RequestError } from '@shared/infra/errors';
import { isValidObjectId } from 'mongoose';
import ICreateTitleDTO from '@modules/games/domain/dtos/ICreateTitleDTO';
import UpdateTitleAdapter from '@modules/games/domain/adapters/UpdateTitle';
import { ITitle } from '@shared/domain/entities';
import Title from '@shared/infra/mongoose/entities/Title';

export default class TitlesRepository implements ITitlesRepository {
  public async findAllFromGame(
    gameId: string,
    name?: string,
  ): Promise<ITitle[]> {
    if (!name) return await Title.find({ game: gameId });

    return Title.find({
      game: gameId,
      name: { $regex: `^${name}`, $options: 'i' },
    });
  }

  public async findOne(
    id: string,
    gameId: string,
  ): Promise<ITitle | undefined> {
    if (!isValidObjectId(id))
      throw new RequestError('Id is invalid!', errorCodes.INVALID_ID);

    const title = await Title.findOne({ _id: id, game: gameId });

    return title || undefined;
  }

  public async create({ name, game }: ICreateTitleDTO): Promise<ITitle> {
    return Title.create({ name, game });
  }

  public async delete(titleId: string, gameId: string): Promise<void> {
    if (!isValidObjectId(titleId))
      throw new RequestError('Id is invalid!', errorCodes.INVALID_ID);

    return Title.deleteOne({ _id: titleId, game: gameId });
  }

  public async update({ id, name }: UpdateTitleAdapter): Promise<ITitle> {
    if (!isValidObjectId(id))
      throw new RequestError('Id is invalid!', errorCodes.INVALID_ID);

    const title = await Title.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          name,
        },
      },
      { new: true },
    );

    if (!title)
      throw new RequestError(
        'Title could not be found',
        errorCodes.RESOURCE_NOT_FOUND,
      );

    return title;
  }
}
