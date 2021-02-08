import faker from 'faker';
import { IGame, ITitle } from '../entities';

export default class FakeTitle implements ITitle {
  public id: string = '';
  public name: string = faker.lorem.word();
  constructor(public game: string | IGame) {}
}
