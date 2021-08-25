import { ILeaderboardsRepository } from '@shared/domain/repositories';
import { LeaderboardsRepository } from '@shared/infra/mongoose/repositories';
import { container } from 'tsyringe';

import '@modules/games/infra/container';
import '@modules/players/providers';
import '@modules/users/infra/container';
import '@shared/infra/container/providers';

container.registerSingleton<ILeaderboardsRepository>(
  'LeaderboardsRepository',
  LeaderboardsRepository,
);
