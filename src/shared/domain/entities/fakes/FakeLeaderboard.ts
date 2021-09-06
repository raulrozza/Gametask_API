import { ILeaderboard } from '@shared/domain/entities';
import { v4 as uuid } from 'uuid';

interface IConstructor {
  id?: string;
  game: string;
}

export default class FakeLeaderboard implements ILeaderboard {
  public id: string;
  public game: string;
  public position = [];
  public createdAt: Date;
  public expiresAt?: Date;

  constructor({ id = uuid(), game }: IConstructor) {
    this.id = id;
    this.game = game;
    this.createdAt = new Date();
  }
}
