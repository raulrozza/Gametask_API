import { container } from 'tsyringe';

import {
  AchievementsRepository,
  ActivitiesRepository,
  GamesRepository,
  TitlesRepository,
} from '@modules/games/infra/mongoose/repositories';
import {
  IAchievementsRepository,
  IActivitiesRepository,
  IGamesRepository,
  ITitlesRepository,
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

container.registerSingleton<ITitlesRepository>(
  'TitlesRepository',
  TitlesRepository,
);
