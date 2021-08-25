import { IPlayer } from '@modules/players/domain/entities';
import { IGame } from '@shared/domain/entities';

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
