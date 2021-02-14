import { IUnlockAchievementRequest } from '@modules/players/entities';
import { IUnlockAchievementRequestRepository } from '@modules/players/repositories';
import UnlockAchievementRequest, {
  IUnlockAchievementRequestDocument,
} from '@modules/players/infra/mongoose/entities/UnlockAchievementRequest';

export default class UnlockAchievementRequestRepository
  implements
    IUnlockAchievementRequestRepository<IUnlockAchievementRequestDocument> {
  public async checkIfRequested(
    requester: string,
    gameId: string,
    achievementId: string,
  ): Promise<boolean> {
    const request = await UnlockAchievementRequest.findOne({
      game: gameId,
      achievement: achievementId,
      requester,
    });

    return Boolean(request);
  }

  public async findAllFromGame(
    gameId: string,
  ): Promise<IUnlockAchievementRequestDocument[]> {
    return await UnlockAchievementRequest.find({ game: gameId })
      .populate({
        path: 'achievement',
        populate: {
          path: 'title',
        },
      })
      .populate({
        path: 'requester',
        populate: {
          path: 'user',
        },
      })
      .sort({ requestDate: -1 });
  }

  public async create({
    requester,
    achievement,
    requestDate,
    information,
    game,
  }: Omit<
    IUnlockAchievementRequest,
    'id'
  >): Promise<IUnlockAchievementRequestDocument> {
    return UnlockAchievementRequest.create({
      requester,
      achievement,
      requestDate,
      information,
      game,
    });
  }

  public async delete(id: string, gameId: string): Promise<void> {
    await UnlockAchievementRequest.deleteOne({ _id: id, game: gameId });
  }
}
