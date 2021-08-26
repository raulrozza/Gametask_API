import {
  IAchievement,
  IGame,
  IRank,
  ITitle,
  IUser,
} from '@shared/domain/entities';

export default interface IPlayer {
  id: string;
  experience: number;
  level: number;
  titles: ITitle[];
  currentTitle?: ITitle;
  rank?: IRank;
  achievements: IAchievement[];
  user: IUser;
  game: IGame;
}
