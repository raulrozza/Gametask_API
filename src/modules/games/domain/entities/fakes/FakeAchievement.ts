import faker from 'faker';
import { IAchievement, IGame, ITitle } from '@modules/games/domain/entities';
import FakeGame from '@modules/games/domain/entities/fakes/FakeGame';

interface IConstructor {
  game: string;
  title?: ITitle;
}

export default class FakeAchievement implements IAchievement {
  public id: string = '';
  public name: string = faker.lorem.word();
  public description: string = faker.lorem.sentence();
  public game: IGame;
  public title?: ITitle;
  constructor({ game, title }: IConstructor) {
    this.game = new FakeGame({ id: game });
    this.title = title;
  }
}
