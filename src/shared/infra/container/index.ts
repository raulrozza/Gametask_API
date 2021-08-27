import {
  IAchievementsRepository,
  IActivitiesRepository,
  IGamesRepository,
  ILeaderboardsRepository,
  ITitlesRepository,
  IUsersRepository,
} from '@shared/domain/repositories';
import {
  AchievementsRepository,
  ActivitiesRepository,
  GamesRepository,
  LeaderboardsRepository,
  TitlesRepository,
  UsersRepository,
} from '@shared/infra/mongoose/repositories';
import { container } from 'tsyringe';

import '@modules/players/infra/container';
import '@modules/users/infra/container';
import '@shared/infra/container/providers';

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

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<ITitlesRepository>(
  'TitlesRepository',
  TitlesRepository,
);
