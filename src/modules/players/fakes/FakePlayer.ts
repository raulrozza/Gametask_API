import faker from 'faker';

import { IPlayer } from '@modules/players/domain/entities';
import { IAchievement, IRank, ITitle, IUser } from '@shared/domain/entities';

export default class FakePlayer implements IPlayer {
  public id: string = '';
  public experience: number = faker.random.number(10000);
  public level: number = faker.random.number(10);
  public titles: ITitle[] = [];
  public currentTitle?: ITitle;
  public rank?: IRank;
  public achievements: IAchievement[] = [];
  constructor(public user: IUser, public game: string) {}
}
