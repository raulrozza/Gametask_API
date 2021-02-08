import { container } from 'tsyringe';

import {
  AchievementsRepository,
  GamesRepository,
  TitlesRepository,
} from '@modules/games/infra/mongoose/repositories';
import {
  IAchievementsRepository,
  IGamesRepository,
  ITitlesRepository,
} from '@modules/games/repositories';

container.registerSingleton<IAchievementsRepository>(
  'AchievementsRepository',
  AchievementsRepository,
);

container.registerSingleton<IGamesRepository>(
  'GamesRepository',
  GamesRepository,
);

container.registerSingleton<ITitlesRepository>(
  'TitlesRepository',
  TitlesRepository,
);
