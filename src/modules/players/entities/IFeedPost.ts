import { IPlayer } from '@modules/players/domain/entities';
import {
  IAchievement,
  IActivity,
  IGame,
  ILevelInfo,
  IRank,
} from '@shared/domain/entities';

export default interface IFeedPost {
  id: string;
  player: string | IPlayer;
  type: 'achievement' | 'activity' | 'level' | 'rank';
  activity?: string | IActivity;
  achievement?: string | IAchievement;
  game: string | IGame;
  level?: ILevelInfo;
  rank?: IRank;
  date: Date;
}
