import { ICompleteActivityRequest } from '@modules/players/domain/entities';
import { IActivity, IUser } from '@shared/domain/entities';
import { FakeActivity, FakeUser } from '@shared/domain/entities/fakes';
import faker from 'faker';
import { v4 as uuid } from 'uuid';

interface IConstructor {
  requester?: string;
  activity?: string;
  game?: string;
}

export default class FakeCompleteActivityRequest
  implements ICompleteActivityRequest {
  public id: string = uuid();
  public requestDate: Date = new Date();
  public completionDate: Date = new Date();
  public information: string = faker.random.words();
  public requester: IUser;
  public activity: IActivity;
  public game: string;
  constructor({ requester, activity, game = uuid() }: IConstructor = {}) {
    this.requester = new FakeUser({ id: requester });
    this.activity = new FakeActivity({ id: activity });
    this.game = game;
  }
}
