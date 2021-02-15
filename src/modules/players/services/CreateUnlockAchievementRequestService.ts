import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import {
  IAchievementsRepository,
  IGamesRepository,
} from '@modules/games/repositories';
import ICreateUnlockAchievementRequestDTO from '@modules/players/dtos/ICreateUnlockAchievementRequestDTO';
import { IUnlockAchievementRequest } from '@modules/players/entities';
import {
  IPlayersRepository,
  IUnlockAchievementRequestRepository,
} from '@modules/players/repositories';
import { RequestError } from '@shared/errors/implementations';
import errorCodes from '@config/errorCodes';

@injectable()
export default class CreateUnlockAchievementRequestService {
  constructor(
    @inject('UnlockAchievementRequestRepository')
    private unlockAchievementRequestRepository: IUnlockAchievementRequestRepository,

    @inject('GamesRepository')
    private gamesRepository: IGamesRepository,

    @inject('AchievementsRepository')
    private achievementsRepository: IAchievementsRepository,

    @inject('PlayersRepository')
    private playersRepository: IPlayersRepository,
  ) {}

  public async execute({
    userId,
    gameId,
    requester,
    achievement,
    requestDate,
    information,
  }: ICreateUnlockAchievementRequestDTO): Promise<IUnlockAchievementRequest> {
    const game = await this.gamesRepository.findOne(gameId);
    if (!game)
      throw new RequestError(
        'Game not found',
        errorCodes.BAD_REQUEST_ERROR,
        404,
      );

    const player = await this.playersRepository.findOne(
      requester,
      userId,
      gameId,
    );
    if (!player)
      throw new RequestError(
        'This player does not exist',
        errorCodes.BAD_REQUEST_ERROR,
        404,
      );

    const foundAchievement = await this.achievementsRepository.findOne(
      achievement,
      gameId,
    );
    if (!foundAchievement)
      throw new RequestError(
        'This achievement does not exist',
        errorCodes.BAD_REQUEST_ERROR,
        404,
      );

    const alreadyRequested = await this.unlockAchievementRequestRepository.checkIfRequested(
      requester,
      gameId,
      achievement,
    );
    if (alreadyRequested)
      throw new RequestError(
        'This achievement was already requested',
        errorCodes.ACHIEVEMENT_REGISTER_ALREADY_EXISTS,
      );

    const request = await this.unlockAchievementRequestRepository.create({
      achievement,
      game: gameId,
      requestDate,
      information,
      requester,
    });

    await this.gamesRepository.updateRegisters(game.id, 1);

    return request;
  }
}
