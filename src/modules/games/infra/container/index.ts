import { container } from 'tsyringe';

import { AchievementsRepository } from '@modules/games/infra/mongoose/repositories';
import { IAchievementsRepository } from '@modules/games/domain/repositories';

container.registerSingleton<IAchievementsRepository>(
  'AchievementsRepository',
  AchievementsRepository,
);
