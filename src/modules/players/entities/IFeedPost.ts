import {
  IAchievement,
  IActivity,
  IGame,
  ILevelInfo,
} from '@modules/games/domain/entities';
import { IPlayer } from '@modules/players/entities';
import { IRank } from '@shared/domain/entities';

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
