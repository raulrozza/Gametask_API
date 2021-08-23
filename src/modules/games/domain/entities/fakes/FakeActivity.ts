import faker from 'faker';
import {
  IActivity,
  IActivityLog,
  IGame,
  IHistory,
} from '@modules/games/domain/entities';
import FakeGame from '@modules/games/domain/entities/fakes/FakeGame';

interface IConstructor {
  id?: string;
  name?: string;
  description?: string;
  experience?: number;
  dmRules?: {
    value?: string;
  };
  game: string;
}

export default class FakeActivity implements IActivity {
  public id: string;
  public name: string;
  public experience: number;
  public description: string;
  public dmRules?: string;
  public changelog: IActivityLog[] = [];
  public history: IHistory[] = [];
  public game: IGame;
  constructor({
    id,
    name,
    description,
    dmRules,
    experience,
    game,
  }: IConstructor) {
    this.id = id || '';
    this.name = name || faker.lorem.word();
    this.experience =
      experience !== undefined ? experience : faker.random.number(1000);
    this.description = description || faker.lorem.sentence();
    this.dmRules = dmRules ? dmRules.value : faker.lorem.sentence();
    this.game = new FakeGame({ id: game });
  }
}
