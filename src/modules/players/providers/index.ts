import { container } from 'tsyringe';

import {
  CompleteActivityRequestRepository,
  PlayersRepository,
  UnlockAchievementRequestRepository,
} from '@modules/players/infra/mongoose/repositories';
import {
  ICompleteActivityRequestRepository,
  IPlayersRepository,
  IUnlockAchievementRequestRepository,
} from '@modules/players/repositories';

container.registerSingleton<IPlayersRepository>(
  'PlayersRepository',
  PlayersRepository,
);

container.registerSingleton<IUnlockAchievementRequestRepository>(
  'UnlockAchievementRequestRepository',
  UnlockAchievementRequestRepository,
);

container.registerSingleton<ICompleteActivityRequestRepository>(
  'CompleteActivityRequestRepository',
  CompleteActivityRequestRepository,
);
