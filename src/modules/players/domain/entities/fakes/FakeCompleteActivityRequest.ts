import { ICompleteActivityRequest } from '@modules/players/domain/entities';
import { IActivity, IUser } from '@shared/domain/entities';
import { FakeActivity, FakeUser } from '@shared/domain/entities/fakes';
import { String } from 'aws-sdk/clients/cloudhsm';
import faker from 'faker';
import { v4 as uuid } from 'uuid';

interface IConstructor {
  requester?: string;
  activity?: string;
  game?: string;
  completionDate?: Date;
  information?: String;
  requestDate?: Date;
}

export default class FakeCompleteActivityRequest
  implements ICompleteActivityRequest {
  public id: string = uuid();
  public requestDate: Date;
  public completionDate: Date;
  public information: string;
  public requester: IUser;
  public activity: IActivity;
  public game: string;
  constructor({
    requester,
    activity,
    game = uuid(),
    requestDate = new Date(),
    completionDate = new Date(),
    information = faker.random.words(),
  }: IConstructor = {}) {
    this.requester = new FakeUser({ id: requester });
    this.activity = new FakeActivity({ id: activity });
    this.game = game;
    this.requestDate = requestDate;
    this.completionDate = completionDate;
    this.information = information;
  }
}
