import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import errorCodes from '@config/errorCodes';
import { RequestError } from '@shared/errors/implementations';

import IUpdateTitleDTO from '@modules/games/dtos/IUpdateTitleDTO';
import { ITitle } from '@modules/games/entities';
import { ITitlesRepository } from '@modules/games/repositories';

@injectable()
export default class UpdateTitleService {
  constructor(
    @inject('TitlesRepository')
    private titlesRepository: ITitlesRepository,
  ) {}

  public async execute({ id, name, gameId }: IUpdateTitleDTO): Promise<ITitle> {
    const title = await this.titlesRepository.findOne(id, gameId);

    if (!title)
      throw new RequestError(
        'This title does not exist',
        errorCodes.RESOURCE_NOT_FOUND,
        400,
      );

    const updatedTitle: ITitle = {
      id,
      name,
      game: gameId,
    };

    await this.titlesRepository.update(updatedTitle);

    return updatedTitle;
  }
}
