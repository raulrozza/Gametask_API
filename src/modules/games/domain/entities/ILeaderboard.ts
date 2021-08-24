import { IPlayer } from '@modules/players/entities';

export interface IPosition {
  player: IPlayer;
  experience: number;
}

export default interface ILeaderboard {
  id: string;
  game: string;
  position: IPosition[];
  createdAt: Date;
  expiresAt?: Date;
}
