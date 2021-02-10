import { container } from 'tsyringe';

import { PlayersRepository } from '@modules/players/infra/mongoose/repositories';
import { IPlayersRepository } from '@modules/players/repositories';

container.registerSingleton<IPlayersRepository>(PlayersRepository);
