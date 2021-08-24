import faker from 'faker';
import { v4 as uuid } from 'uuid';

import { IPlayer } from '@modules/players/domain/entities';
import { IAchievement, IRank, ITitle, IUser } from '@shared/domain/entities';

interface IConstructor {
  user: IUser;
  game?: string;
}

export default class FakePlayer implements IPlayer {
  public id: string = uuid();
  public experience: number = faker.random.number(10000);
  public level: number = faker.random.number(10);
  public titles: ITitle[] = [];
  public currentTitle?: ITitle;
  public rank?: IRank;
  public achievements: IAchievement[] = [];
  public user: IUser;
  public game: string;
  constructor({ user, game = uuid() }: IConstructor) {
    this.user = user;
    this.game = game;
  }
}
