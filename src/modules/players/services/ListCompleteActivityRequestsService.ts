import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import { ICompleteActivityRequest } from '@modules/players/domain/entities';
import { ICompleteActivityRequestRepository } from '@modules/players/domain/repositories';

@injectable()
export default class ListCompleteActivityRequestsService {
  constructor(
    @inject('CompleteActivityRequestRepository')
    private completeActivityRequestRepository: ICompleteActivityRequestRepository,
  ) {}

  public async execute(gameId: string): Promise<ICompleteActivityRequest[]> {
    return this.completeActivityRequestRepository.findAllFromGame(gameId);
  }
}
