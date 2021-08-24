import { ITitle } from '@shared/domain/entities';
import faker from 'faker';
import { v4 as uuid } from 'uuid';

interface IConstructor {
  id?: string;
  name?: string;
  game?: string;
}

export default class FakeTitle implements ITitle {
  public id: string;
  public name: string;
  public game: string;
  constructor({
    id = uuid(),
    name = faker.lorem.word(),
    game = uuid(),
  }: IConstructor = {}) {
    this.id = id;
    this.name = name;
    this.game = game;
  }
}
