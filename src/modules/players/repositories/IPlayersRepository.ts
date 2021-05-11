import { IPlayer } from '@modules/players/entities';

export default interface IPlayersRepository<T extends IPlayer = IPlayer> {
  findAllFromUser(userId: string): Promise<T[]>;
  findOne(id: string, userId: string, gameId: string): Promise<T | undefined>;
  findById(id: string): Promise<T | undefined>;
  create(player: Omit<IPlayer, 'id'>): Promise<T>;
  isThereAPlayerAssociatedWith(
    userId: string,
    gameId: string,
  ): Promise<boolean>;
  update(player: IPlayer, session?: object): Promise<IPlayer>;
  unlockAchievement(
    id: string,
    achievement: string,
    title: string | undefined,
    session?: object,
  ): Promise<IPlayer>;
}
