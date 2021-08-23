import faker from 'faker';
import {
  IActivity,
  IActivityLog,
  IGame,
  IHistory,
} from '@modules/games/domain/entities';
import FakeGame from '@modules/games/domain/entities/fakes/FakeGame';

interface IConstructor {
  game: string;
}

export default class FakeActivity implements IActivity {
  public id: string = '';
  public name: string = faker.lorem.word();
  public experience: number = faker.random.number(1000);
  public description: string = faker.lorem.sentence();
  public dmRules: string = faker.lorem.sentence();
  public changelog: IActivityLog[] = [];
  public history: IHistory[] = [];
  public game: IGame;
  constructor({ game }: IConstructor) {
    this.game = new FakeGame({ id: game });
  }
}
