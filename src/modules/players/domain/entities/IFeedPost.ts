import { IPlayer } from '@modules/players/domain/entities';
import { IAchievement, IActivity } from '@shared/domain/entities';

export default interface IFeedPost {
  id: string;
  player: IPlayer;
  type: 'achievement' | 'activity' | 'level' | 'rank';
  activity?: IActivity;
  achievement?: IAchievement;
  game: string;
  date: Date;
}
