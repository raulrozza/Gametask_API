import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import errorCodes from '@config/errorCodes';

import IStorageProvider from '@shared/domain/providers/IStorageProvider';
import { RequestError } from '@shared/infra/errors';

import IUpdateGameAvatarDTO from '@modules/games/domain/dtos/IUpdateGameAvatarDTO';
import { IGamesRepository } from '@shared/domain/repositories';

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
    try {
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

      const updatedGame = await this.gamesRepository.updateAvatar(id, filename);

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
