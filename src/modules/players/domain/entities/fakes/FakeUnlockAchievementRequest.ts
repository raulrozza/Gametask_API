import { IUnlockAchievementRequest } from '@modules/players/domain/entities';
import { IAchievement, IUser } from '@shared/domain/entities';
import { FakeAchievement, FakeUser } from '@shared/domain/entities/fakes';
import faker from 'faker';
import { v4 as uuid } from 'uuid';

interface IConstructor {
  game?: string;
  requester?: string;
  achievement?: string;
  requestDate?: Date;
  information?: string;
}

export default class FakeUnlockAchievementRequest
  implements IUnlockAchievementRequest {
  public id: string = uuid();
  public requestDate: Date;
  public information: string;
  public game: string;
  public requester: IUser;
  public achievement: IAchievement;
  constructor({
    game = uuid(),
    requester,
    achievement,
    requestDate = new Date(),
    information = faker.random.words(),
  }: IConstructor = {}) {
    this.game = game;
    this.requester = new FakeUser({ id: requester });
    this.achievement = new FakeAchievement({ id: achievement });
    this.requestDate = requestDate;
    this.information = information;
  }
}
