import faker from 'faker';
import { IGame } from '@modules/games/domain/entities';
import FakeGame from '@modules/games/domain/entities/fakes/FakeGame';
import { v4 as uuid } from 'uuid';
import { IActivity, IActivityLog, IHistory } from '@shared/domain/entities';

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
    id = uuid(),
    name = faker.lorem.word(),
    description = faker.lorem.sentence(),
    dmRules = { value: faker.lorem.sentence() },
    experience = faker.random.number(1000),
    game,
  }: IConstructor) {
    this.id = id;
    this.name = name;
    this.experience = experience;
    this.description = description;
    this.dmRules = dmRules?.value;
    this.game = new FakeGame({ id: game });
  }
}
