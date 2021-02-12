import faker from 'faker';
import { ICompleteActivityRequest } from '@modules/players/entities';

export default class FakeCompleteActivityRequest
  implements ICompleteActivityRequest {
  public requestDate: Date = new Date();
  public completionDate: Date = new Date();
  public information: string = faker.random.words();
  constructor(
    public requester: string,
    public activity: string,
    public game: string,
  ) {}
}
