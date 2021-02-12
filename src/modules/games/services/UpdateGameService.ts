import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import errorCodes from '@config/errorCodes';
import { RequestError } from '@shared/errors/implementations';

import IUpdateGameDTO from '@modules/games/dtos/IUpdateGameDTO';
import { IGame } from '@modules/games/entities';
import { IGamesRepository } from '@modules/games/repositories';

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
    const game = await this.gamesRepository.findOne(id, adminId);

    if (!game)
      throw new RequestError(
        'This game does not exist',
        errorCodes.RESOURCE_NOT_FOUND,
        400,
      );

    const updatedGame = await this.gamesRepository.update({
      id: game.id,
      name,
      description,
      theme,
      levelInfo,
      ranks,
      administrators: game.administrators,
      image: game.image,
      newRegisters: game.newRegisters,
    });

    return updatedGame;
  }
}
