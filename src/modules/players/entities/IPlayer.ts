import { IAchievement, IGame, ITitle } from '@modules/games/domain/entities';
import { IRank, IUser } from '@shared/domain/entities';

export default interface IPlayer {
  id: string;
  experience: number;
  level: number;
  titles: string[] | ITitle[];
  currentTitle?: string | ITitle;
  rank?: IRank;
  achievements: string[] | IAchievement[];
  user: string | IUser;
  game: string | IGame;
}
