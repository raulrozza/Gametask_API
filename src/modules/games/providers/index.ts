import { container } from 'tsyringe';

import GamesRepository from '@modules/games/infra/mongoose/repositories/GamesRepository';
import { IGamesRepository } from '@modules/games/repositories';

container.registerSingleton<IGamesRepository>(
  'GamesRepository',
  GamesRepository,
);
