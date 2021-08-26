import {
  IActivitiesRepository,
  ILeaderboardsRepository,
  ITitlesRepository,
} from '@shared/domain/repositories';
import {
  ActivitiesRepository,
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

container.registerSingleton<ILeaderboardsRepository>(
  'LeaderboardsRepository',
  LeaderboardsRepository,
);

container.registerSingleton<ITitlesRepository>(
  'TitlesRepository',
  TitlesRepository,
);
