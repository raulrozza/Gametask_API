import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import { ITitlesRepository } from '@modules/games/repositories';
import { IDeleteTitleDTO } from '@modules/games/dtos/IDeleteTitleDTO';

@injectable()
export default class DeleteTitleService {
  constructor(
    @inject('TitlesRepository')
    private titlesRepository: ITitlesRepository,
  ) {}

  public async execute({ gameId, titleId }: IDeleteTitleDTO): Promise<void> {
    await this.titlesRepository.delete(titleId, gameId);
  }
}
