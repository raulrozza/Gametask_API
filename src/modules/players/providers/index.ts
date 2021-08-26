import { container } from 'tsyringe';

import {
  CompleteActivityRequestRepository,
  FeedPostsRepository,
  PlayersRepository,
  UnlockAchievementRequestRepository,
} from '@modules/players/infra/mongoose/repositories';
import {
  ICompleteActivityRequestRepository,
  IFeedPostsRepository,
  IUnlockAchievementRequestRepository,
} from '@modules/players/repositories';
import { IPlayersRepository } from '@modules/players/domain/repositories';

container.registerSingleton<IFeedPostsRepository>(
  'FeedPostsRepository',
  FeedPostsRepository,
);

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
