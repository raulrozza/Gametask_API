import faker from 'faker';
import { FakeTheme } from '.';
import { IGame, ILevelInfo, IRank } from '@modules/games/domain/entities';
import { IUser } from '@shared/domain/entities';

interface IConstructor {
  id?: string;
}

export default class FakeGame implements IGame {
  public id: string = '';
  public name: string = faker.hacker.noun();
  public description: string = faker.hacker.phrase();
  public theme = new FakeTheme();
  public administrators: IUser[] = [];
  public levelInfo: ILevelInfo[] = [];
  public ranks: IRank[] = [];
  public newRegisters = 0;

  constructor({ id }: IConstructor = {}) {
    if (id) this.id = id;
  }
}
