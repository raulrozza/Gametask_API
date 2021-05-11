import { IAchievement, IGame } from '@modules/games/entities';
import { IUser } from '@modules/users/entities';

export default interface IUnlockAchievementRequest {
  id: string;
  requester: string | IUser;
  achievement: string | IAchievement;
  requestDate: Date;
  information?: string;
  game: string | IGame;
}
