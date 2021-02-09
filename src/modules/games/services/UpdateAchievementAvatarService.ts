import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import errorCodes from '@config/errorCodes';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import { RequestError } from '@shared/errors/implementations';

import IUpdateAchievementAvatarDTO from '@modules/games/dtos/IUpdateAchievementAvatarDTO';
import { IAchievementsRepository } from '@modules/games/repositories';

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
    achievement.image = filename;

    await this.achievementRepository.update(achievement);

    return achievement;
  }
}
