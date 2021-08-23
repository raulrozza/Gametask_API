import faker from 'faker';
import { IAchievement, IGame, ITitle } from '@modules/games/domain/entities';
import FakeGame from '@modules/games/domain/entities/fakes/FakeGame';
import FakeTitle from '@modules/games/domain/entities/fakes/FakeTitle';

interface IConstructor {
  id?: string;
  name?: string;
  description?: string;
  game: string;
  title?: string | ITitle;
}

export default class FakeAchievement implements IAchievement {
  public id: string;
  public name: string;
  public description: string;
  public game: IGame;
  public title?: ITitle;
  constructor({ id, name, description, game, title }: IConstructor) {
    this.id = id || '';
    this.name = name || faker.lorem.word();
    this.description = description || faker.lorem.sentence();
    this.game = new FakeGame({ id: game });
    this.title =
      typeof title === 'string' ? new FakeTitle({ id: title }) : title;
  }
}
