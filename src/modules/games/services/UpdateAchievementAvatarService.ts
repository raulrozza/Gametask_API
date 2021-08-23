import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import errorCodes from '@config/errorCodes';

import IStorageProvider from '@shared/domain/providers/IStorageProvider';
import { RequestError } from '@shared/infra/errors';

import IUpdateAchievementAvatarDTO from '@modules/games/domain/dtos/IUpdateAchievementAvatarDTO';
import { IAchievementsRepository } from '@modules/games/domain/repositories';

const ACHIEVEMENT_FOLDER = 'achievement';

@injectable()
export default class UpdateAchievementAvatarService {
  constructor(
    @inject('AchievementsRepository')
    private achievementRepository: IAchievementsRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({ filename, id, gameId }: IUpdateAchievementAvatarDTO) {
    try {
      const achievement = await this.achievementRepository.findOne(id, gameId);

      if (!achievement) {
        throw new RequestError(
          'Could not find achievement on database',
          errorCodes.RESOURCE_NOT_FOUND,
        );
      }

      if (achievement.image)
        await this.storageProvider.deleteFile(
          achievement.image,
          ACHIEVEMENT_FOLDER,
        );

      await this.storageProvider.saveFile(filename, ACHIEVEMENT_FOLDER);

      const updatedAchievement = await this.achievementRepository.updateAvatar(
        id,
        filename,
      );

      return updatedAchievement;
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
