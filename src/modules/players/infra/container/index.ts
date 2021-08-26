import { container } from 'tsyringe';

import {
  CompleteActivityRequestRepository,
  FeedPostsRepository,
  PlayersRepository,
  UnlockAchievementRequestRepository,
} from '@modules/players/infra/mongoose/repositories';
import {
  IFeedPostsRepository,
  ICompleteActivityRequestRepository,
  IPlayersRepository,
  IUnlockAchievementRequestRepository,
} from '@modules/players/domain/repositories';

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
