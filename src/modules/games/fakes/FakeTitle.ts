import faker from 'faker';
import { ITitle } from '@modules/games/domain/entities';

export default class FakeTitle implements ITitle {
  public id: string = '';
  public name: string = faker.lorem.word();
  constructor(public game: string) {}
}
