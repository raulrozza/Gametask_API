import faker from 'faker';
import { v4 as uuid } from 'uuid';
import { ITitle } from '@shared/domain/entities';
import { FakeTitle } from '@shared/domain/entities/fakes';
import IAchievement from '@shared/domain/entities/IAchievement';
import IGame from '@shared/domain/entities/IGame';
import FakeGame from '@shared/domain/entities/fakes/FakeGame';

interface IConstructor {
  id?: string;
  name?: string;
  description?: string;
  game?: string;
  title?: string | ITitle;
}

export default class FakeAchievement implements IAchievement {
  public id: string;
  public name: string;
  public description: string;
  public game: IGame;
  public title?: ITitle;
  constructor({
    id = uuid(),
    name = faker.lorem.word(),
    description = faker.lorem.sentence(),
    game,
    title,
  }: IConstructor = {}) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.game = new FakeGame({ id: game });
    this.title =
      typeof title === 'string' ? new FakeTitle({ id: title }) : title;
  }
}
