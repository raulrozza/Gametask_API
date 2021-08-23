import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import { ITitlesRepository } from '@modules/games/domain/repositories';
import { IDeleteTitleDTO } from '@modules/games/domain/dtos/IDeleteTitleDTO';

@injectable()
export default class DeleteTitleService {
  constructor(
    @inject('TitlesRepository')
    private titlesRepository: ITitlesRepository,
  ) {}

  public async execute({ gameId, titleId }: IDeleteTitleDTO): Promise<void> {
    return this.titlesRepository.delete(titleId, gameId);
  }
}
