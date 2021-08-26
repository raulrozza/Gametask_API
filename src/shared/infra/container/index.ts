import {
  IActivitiesRepository,
  IGamesRepository,
  ILeaderboardsRepository,
  ITitlesRepository,
} from '@shared/domain/repositories';
import {
  ActivitiesRepository,
  GamesRepository,
  LeaderboardsRepository,
  TitlesRepository,
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

container.registerSingleton<ITitlesRepository>(
  'TitlesRepository',
  TitlesRepository,
);
