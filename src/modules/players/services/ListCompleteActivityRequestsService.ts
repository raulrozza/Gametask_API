import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import { ICompleteActivityRequestRepository } from '@modules/players/repositories';
import { ICompleteActivityRequest } from '../entities';

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
