import { inject, injectable } from 'tsyringe';

@injectable()
export default class CreateUnlockAchievementRequestService {
  constructor(
    @inject('Unlock')
  ) {}
}
