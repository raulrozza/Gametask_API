import { IGame } from '@modules/games/domain/entities';
import { IAchievement, IUser } from '@shared/domain/entities';

export default interface IUnlockAchievementRequest {
  id: string;
  requester: string | IUser;
  achievement: string | IAchievement;
  requestDate: Date;
  information?: string;
  game: string | IGame;
}
