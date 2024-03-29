import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import errorCodes from '@config/errorCodes';
import { RequestError } from '@shared/infra/errors';

import IUpdateGameDTO from '@modules/games/domain/dtos/IUpdateGameDTO';
import { IGamesRepository } from '@shared/domain/repositories';
import UpdateGameAdapter from '@modules/games/domain/adapters/UpdateGameAdapter';
import { IGame } from '@shared/domain/entities';

@injectable()
export default class UpdateGameService {
  constructor(
    @inject('GamesRepository')
    private gamesRepository: IGamesRepository,
  ) {}

  public async execute({
    adminId,
    id,
    name,
    description,
    theme,
    levelInfo,
    ranks,
  }: IUpdateGameDTO): Promise<IGame> {
    try {
      const game = await this.gamesRepository.findOne(id, adminId);

      if (!game)
        throw new RequestError(
          'This game does not exist',
          errorCodes.RESOURCE_NOT_FOUND,
          400,
        );

      const updatedGame = await this.gamesRepository.update(
        new UpdateGameAdapter({
          id,
          name,
          description,
          theme,
          levelInfo,
          ranks,
        }),
      );

      return updatedGame;
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
