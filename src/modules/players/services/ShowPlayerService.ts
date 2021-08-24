import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import { IPlayersRepository } from '@modules/players/repositories';
import IShowPlayerDTO from '@modules/players/dtos/IShowPlayerDTO';
import { IPlayer } from '@modules/players/domain/entities';

@injectable()
export default class ShowPlayerService {
  constructor(
    @inject('PlayersRepository')
    private playersRepository: IPlayersRepository,
  ) {}

  public async execute({
    id,
    userId,
    gameId,
  }: IShowPlayerDTO): Promise<IPlayer | undefined> {
    return await this.playersRepository.findOne(id, userId, gameId);
  }
}
