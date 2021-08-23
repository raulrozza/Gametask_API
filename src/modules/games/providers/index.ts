import { container } from 'tsyringe';

import {
  AchievementsRepository,
  ActivitiesRepository,
  GamesRepository,
  LeaderboardsRepository,
  TitlesRepository,
} from '@modules/games/infra/mongoose/repositories';
import {
  IAchievementsRepository,
  IActivitiesRepository,
  IGamesRepository,
  ILeaderboardsRepository,
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

container.registerSingleton<ILeaderboardsRepository>(
  'LeaderboardsRepository',
  LeaderboardsRepository,
);

container.registerSingleton<ITitlesRepository>(
  'TitlesRepository',
  TitlesRepository,
);
