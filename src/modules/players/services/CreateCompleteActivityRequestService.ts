import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import { IGamesRepository } from '@modules/games/repositories';
import { ICompleteActivityRequestRepository } from '@modules/players/repositories';
import { ICompleteActivityRequest } from '@modules/players/entities';
import ICreateCompleteActivityRequestDTO from '@modules/players/dtos/ICreateCompleteActivityRequestDTO';
import { RequestError } from '@shared/errors/implementations';
import errorCodes from '@config/errorCodes';

@injectable()
export default class CreateCompleteActivityRequestService {
  constructor(
    @inject('CompleteActivityRequestRepository')
    private completeActivityRequestRepository: ICompleteActivityRequestRepository,

    @inject('GamesRepository')
    private gamesRepository: IGamesRepository,
  ) {}

  public async execute({
    activity,
    gameId,
    requester,
    completionDate,
    information,
    requestDate,
  }: ICreateCompleteActivityRequestDTO): Promise<ICompleteActivityRequest> {
    const game = await this.gamesRepository.findOne(gameId);
    if (!game)
      throw new RequestError(
        'This game does not exist',
        errorCodes.BAD_REQUEST_ERROR,
      );

    const request = await this.completeActivityRequestRepository.create({
      activity,
      game: gameId,
      requester,
      completionDate,
      information,
      requestDate,
    });

    return request;
  }
}
