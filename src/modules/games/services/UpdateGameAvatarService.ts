import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import errorCodes from '@config/errorCodes';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import { RequestError } from '@shared/errors/implementations';

import IUpdateGameAvatarDTO from '@modules/games/dtos/IUpdateGameAvatarDTO';
import { IGamesRepository } from '@modules/games/repositories';

const GAME_FOLDER = 'game';

@injectable()
export default class UpdateGameAvatarService {
  constructor(
    @inject('GamesRepository')
    private gamesRepository: IGamesRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({ filename, id, userId }: IUpdateGameAvatarDTO) {
    const game = await this.gamesRepository.findOne(id, userId);

    if (!game) {
      throw new RequestError(
        'Could not find game on database',
        errorCodes.RESOURCE_NOT_FOUND,
      );
    }

    if (game.image)
      await this.storageProvider.deleteFile(game.image, GAME_FOLDER);

    await this.storageProvider.saveFile(filename, GAME_FOLDER);

    const updatedGame = await this.gamesRepository.update({
      id: game.id,
      name: game.name,
      description: game.description,
      levelInfo: game.levelInfo,
      ranks: game.ranks,
      newRegisters: game.newRegisters,
      theme: game.theme,
      administrators: game.administrators,
      image: filename,
    });

    return updatedGame;
  }
}
