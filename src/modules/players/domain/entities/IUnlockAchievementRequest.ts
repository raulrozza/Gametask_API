import { IAchievement, IUser } from '@shared/domain/entities';

export default interface IUnlockAchievementRequest {
  id: string;
  requester: IUser;
  achievement: IAchievement;
  requestDate: Date;
  information?: string;
  game: string;
}
