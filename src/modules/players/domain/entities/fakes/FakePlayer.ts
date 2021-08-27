import faker from 'faker';
import { v4 as uuid } from 'uuid';

import { IPlayer } from '@modules/players/domain/entities';
import {
  IAchievement,
  IGame,
  IRank,
  ITitle,
  IUser,
} from '@shared/domain/entities';
import { FakeGame, FakeUser } from '@shared/domain/entities/fakes';

interface IConstructor {
  id?: string;
  user?: string;
  game?: string;
  level?: number;
  rank?: IRank;
  experience?: number;
}

export default class FakePlayer implements IPlayer {
  public id: string;
  public experience: number;
  public level: number;
  public titles: ITitle[] = [];
  public currentTitle?: ITitle;
  public rank?: IRank;
  public achievements: IAchievement[] = [];
  public user: IUser;
  public game: IGame;
  constructor({
    user,
    game,
    id = uuid(),
    level = faker.random.number(10),
    rank,
    experience = faker.random.number(10000),
  }: IConstructor) {
    this.id = id;
    this.user = new FakeUser({ id: user });
    this.game = new FakeGame({ id: game });
    this.level = level;
    this.rank = rank;
    this.experience = experience;
  }
}
