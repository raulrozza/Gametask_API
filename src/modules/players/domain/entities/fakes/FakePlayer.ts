import faker from 'faker';
import { v4 as uuid } from 'uuid';

import { IPlayer } from '@modules/players/domain/entities';
import { IAchievement, IRank, ITitle, IUser } from '@shared/domain/entities';
import { FakeUser } from '@shared/domain/entities/fakes';

interface IConstructor {
  id?: string;
  user?: string;
  game?: string;
}

export default class FakePlayer implements IPlayer {
  public id: string;
  public experience: number = faker.random.number(10000);
  public level: number = faker.random.number(10);
  public titles: ITitle[] = [];
  public currentTitle?: ITitle;
  public rank?: IRank;
  public achievements: IAchievement[] = [];
  public user: IUser;
  public game: string;
  constructor({ user = uuid(), game = uuid(), id = uuid() }: IConstructor) {
    this.id = id;
    this.user = new FakeUser({ id: user });
    this.game = game;
  }
}
