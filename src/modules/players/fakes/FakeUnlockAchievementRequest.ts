import faker from 'faker';
import { IUnlockAchievementRequest } from '@modules/players/entities';

export default class FakeUnlockAchievementRequest
  implements IUnlockAchievementRequest {
  public id: string = '';
  public requestDate: Date = new Date();
  public information: string = faker.random.words();
  constructor(
    public game: string,
    public requester: string,
    public achievement: string,
  ) {}
}
