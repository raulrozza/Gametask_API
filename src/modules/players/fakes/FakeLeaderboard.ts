import { ILeaderboard } from '@modules/players/entities';
import { IGame } from '@shared/domain/entities';
import { IPosition } from '../entities/ILeaderboard';

export default class FakeLeaderboard implements ILeaderboard {
  public id: string = '';
  public position: IPosition[] = [];
  public createdAt: Date = new Date();
  constructor(public game: string | IGame) {}
}
