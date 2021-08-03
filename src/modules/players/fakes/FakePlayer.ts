import faker from 'faker';

import { IPlayer } from '@modules/players/entities';
import { IAchievement, IGame, IRank, ITitle } from '@modules/games/entities';
import { IUser } from '@modules/users/domain/entities';

export default class FakePlayer implements IPlayer {
  public id: string = '';
  public experience: number = faker.random.number(10000);
  public level: number = faker.random.number(10);
  public titles: string[] | ITitle[] = [];
  public currentTitle?: string | ITitle;
  public rank?: IRank;
  public achievements: string[] | IAchievement[] = [];
  constructor(public user: string | IUser, public game: string | IGame) {}
}
