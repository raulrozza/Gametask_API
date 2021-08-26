import {
  IActivitiesRepository,
  IGamesRepository,
  ILeaderboardsRepository,
  ITitlesRepository,
  IUsersRepository,
} from '@shared/domain/repositories';
import {
  ActivitiesRepository,
  GamesRepository,
  LeaderboardsRepository,
  TitlesRepository,
  UsersRepository,
} from '@shared/infra/mongoose/repositories';
import { container } from 'tsyringe';

import '@modules/games/infra/container';
import '@modules/players/infra/container';
import '@modules/users/infra/container';
import '@shared/infra/container/providers';

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
