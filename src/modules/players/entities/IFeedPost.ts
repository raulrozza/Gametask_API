import {
  IAchievement,
  IActivity,
  IGame,
  ILevelInfo,
  IRank,
} from '@modules/games/entities';
import { IPlayer } from '@modules/players/entities';

export default interface IFeedPost {
  player: string | IPlayer;
  type: 'achievement' | 'activity' | 'level' | 'rank';
  activity?: string | IActivity;
  achievement?: string | IAchievement;
  game: string | IGame;
  level?: ILevelInfo;
  rank?: IRank;
  date: Date;
}
