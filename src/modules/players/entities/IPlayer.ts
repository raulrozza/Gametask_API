import { IAchievement, IGame, IRank, ITitle } from '@modules/games/entities';
import { IUser } from '@modules/users/entities';

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
