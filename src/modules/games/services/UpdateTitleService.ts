import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import errorCodes from '@config/errorCodes';
import { RequestError } from '@shared/infra/errors';

import IUpdateTitleDTO from '@modules/games/domain/dtos/IUpdateTitleDTO';
import { ITitle } from '@modules/games/entities';
import { ITitlesRepository } from '@modules/games/repositories';

@injectable()
export default class UpdateTitleService {
  constructor(
    @inject('TitlesRepository')
    private titlesRepository: ITitlesRepository,
  ) {}

  public async execute({ id, name, gameId }: IUpdateTitleDTO): Promise<ITitle> {
    try {
      const title = await this.titlesRepository.findOne(id, gameId);

      if (!title)
        throw new RequestError(
          'This title does not exist',
          errorCodes.RESOURCE_NOT_FOUND,
          400,
        );

      const updatedTitle = await this.titlesRepository.update({
        id: title.id,
        game: title.game,
        name,
      });

      return updatedTitle;
    } catch (error) {
      if (error instanceof RequestError) throw error;

      throw new RequestError(
        error.message,
        errorCodes.INTERNAL_SERVER_ERROR,
        500,
      );
    }
  }
}
