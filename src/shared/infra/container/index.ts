import {
  ILeaderboardsRepository,
  ITitlesRepository,
} from '@shared/domain/repositories';
import { LeaderboardsRepository } from '@shared/infra/mongoose/repositories';
import { container } from 'tsyringe';
import { TitlesRepository } from '@modules/games/infra/mongoose/repositories';

import '@modules/games/infra/container';
import '@modules/players/infra/container';
import '@modules/users/infra/container';
import '@shared/infra/container/providers';

container.registerSingleton<ILeaderboardsRepository>(
  'LeaderboardsRepository',
  LeaderboardsRepository,
);

container.registerSingleton<ITitlesRepository>(
  'TitlesRepository',
  TitlesRepository,
);
