import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import { ITitlesRepository } from '@modules/games/repositories';
import { ITitle } from '@modules/games/entities';
import IListTitlesDTO from '@modules/games/dtos/IListTitlesDTO';

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
