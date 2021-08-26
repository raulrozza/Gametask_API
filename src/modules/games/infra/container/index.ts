import { container } from 'tsyringe';

import {
  AchievementsRepository,
  ActivitiesRepository,
  GamesRepository,
} from '@modules/games/infra/mongoose/repositories';
import {
  IAchievementsRepository,
  IActivitiesRepository,
  IGamesRepository,
} from '@modules/games/domain/repositories';

container.registerSingleton<IAchievementsRepository>(
  'AchievementsRepository',
  AchievementsRepository,
);

container.registerSingleton<IActivitiesRepository>(
  'ActivitiesRepository',
  ActivitiesRepository,
);

container.registerSingleton<IGamesRepository>(
  'GamesRepository',
  GamesRepository,
);
