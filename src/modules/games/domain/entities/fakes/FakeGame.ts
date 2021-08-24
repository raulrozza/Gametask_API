import faker from 'faker';
import { FakeTheme } from '.';
import { IGame, ILevelInfo, IRank } from '@modules/games/domain/entities';
import { IUser } from '@shared/domain/entities';
import { v4 as uuid } from 'uuid';

interface IConstructor {
  id?: string;
  name?: string;
  description?: string;
  administrators?: IUser[];
}

export default class FakeGame implements IGame {
  public id: string;
  public name: string;
  public description: string;
  public theme = new FakeTheme();
  public administrators: IUser[];
  public levelInfo: ILevelInfo[] = [];
  public ranks: IRank[] = [];
  public newRegisters = 0;

  constructor({
    id = uuid(),
    name = faker.hacker.noun(),
    description = faker.hacker.phrase(),
    administrators = [],
  }: IConstructor = {}) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.administrators = administrators;
  }
}
