import faker from 'faker';
import { ITitle } from '@modules/games/domain/entities';

interface IConstructor {
  id?: string;
  game?: string;
}

export default class FakeTitle implements ITitle {
  public id: string = '';
  public name: string = faker.lorem.word();
  public game: string = '';
  constructor({ id, game }: IConstructor = {}) {
    if (id) this.id = id;
    if (game) this.game = game;
  }
}
