import faker from 'faker';
import { FakeTheme } from '.';
import { IGame, ILevelInfo, IRank } from '@modules/games/domain/entities';

export default class FakeGame implements IGame {
  public id: string = '';
  public name: string = faker.hacker.noun();
  public description: string = faker.hacker.phrase();
  public theme = new FakeTheme();
  public administrators: string[] = [];
  public levelInfo: ILevelInfo[] = [];
  public ranks: IRank[] = [];
  public newRegisters = 0;
}
