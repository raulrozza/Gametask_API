import { IRank, ITitle } from '@modules/games/domain/entities';
import { IUser } from '@shared/domain/entities';

export interface IPositionedPlayer {
  id: string;
  level: number;
  currentTitle?: ITitle;
  rank?: IRank;
  user: IUser;
}

export interface IPosition {
  player: IPositionedPlayer;
  experience: number;
}

export default interface ILeaderboard {
  id: string;
  game: string;
  position: IPosition[];
  createdAt: Date;
  expiresAt?: Date;
}
