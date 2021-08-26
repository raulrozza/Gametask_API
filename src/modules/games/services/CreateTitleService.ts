import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import { ITitlesRepository } from '@shared/domain/repositories';
import ICreateTitleDTO from '@modules/games/domain/dtos/ICreateTitleDTO';
import { ITitle } from '@shared/domain/entities';

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
