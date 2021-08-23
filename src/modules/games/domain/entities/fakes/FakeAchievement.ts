import faker from 'faker';
import { IAchievement, IGame, ITitle } from '@modules/games/domain/entities';

export default class FakeAchievement implements IAchievement {
  public id: string = '';
  public name: string = faker.lorem.word();
  public description: string = faker.lorem.sentence();
  constructor(public game: string | IGame, public title?: string | ITitle) {}
}
