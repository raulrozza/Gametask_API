import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import { ITitlesRepository } from '@modules/games/repositories';
import { ITitle } from '@modules/games/entities';
import ICreateTitleDTO from '@modules/games/dtos/ICreateTitleDTO';

@injectable()
export default class CreateTitleService {
  constructor(
    @inject('TitlesRepository')
    private titlesRepository: ITitlesRepository,
  ) {}

  public async execute({ name, game }: ICreateTitleDTO): Promise<ITitle> {
    return this.titlesRepository.create({ name, game });
  }
}
