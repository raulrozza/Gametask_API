import { IGame } from '@modules/games/domain/entities';
import { IPlayer } from '@modules/players/entities';

export interface IPosition {
  player: string | IPlayer;
  experience: number;
}

export default interface ILeaderboard {
  id: string;
  game: string | IGame;
  position: IPosition[];
  createdAt: Date;
  expiresAt?: Date;
}
