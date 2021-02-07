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

  public async execute({ filename, id }: IUpdateGameAvatarDTO) {
    const game = await this.gamesRepository.findOne(id);

    if (!game) {
      throw new RequestError(
        'Could not find game on database',
        errorCodes.RESOURCE_NOT_FOUND,
      );
    }

    if (game.image)
      await this.storageProvider.deleteFile(game.image, GAME_FOLDER);

    await this.storageProvider.saveFile(filename, GAME_FOLDER);
    game.image = filename;

    await this.gamesRepository.update(game);

    return game;
  }
}
