import { container } from 'tsyringe';

import {
  AchievementsRepository,
  GamesRepository,
} from '@modules/games/infra/mongoose/repositories';
import {
  IAchievementsRepository,
  IGamesRepository,
} from '@modules/games/domain/repositories';

container.registerSingleton<IAchievementsRepository>(
  'AchievementsRepository',
  AchievementsRepository,
);

container.registerSingleton<IGamesRepository>(
  'GamesRepository',
  GamesRepository,
);
