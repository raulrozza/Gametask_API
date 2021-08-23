import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import { ITitlesRepository } from '@modules/games/domain/repositories';
import { ITitle } from '@modules/games/domain/entities';
import IListTitlesDTO from '@modules/games/domain/dtos/IListTitlesDTO';

@injectable()
export default class ListGamesService {
  constructor(
    @inject('TitlesRepository')
    private titlesRepository: ITitlesRepository,
  ) {}

  public async execute({ gameId, name }: IListTitlesDTO): Promise<ITitle[]> {
    return this.titlesRepository.findAllFromGame(gameId, name);
  }
}
