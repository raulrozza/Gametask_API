import { IPlayersRepository } from '@modules/players/domain/repositories';
import { IFindOnePlayerParams } from '@modules/players/domain/repositories/IPlayersRepository';
import { IPlayer } from '@modules/players/domain/entities';
import CreatePlayerAdapter from '@modules/players/domain/adapters/CreatePlayer';
import { FakePlayer } from '@modules/players/domain/entities/fakes';
import UpdatePlayerAdapter from '@modules/players/domain/adapters/UpdatePlayer';
import { FakeAchievement, FakeTitle } from '@shared/domain/entities/fakes';
import AddAchievementToPlayerAdapter from '@modules/players/domain/adapters/AddAchievementToPlayer';

export default class FakePlayersRepository implements IPlayersRepository {
  private readonly players: IPlayer[] = [];

  public async findAllFromUser(userId: string): Promise<IPlayer[]> {
    return Promise.resolve(
      this.players.filter(player =>
        typeof player.user === 'string'
          ? player.user === userId
          : player.user.id === userId,
      ),
    );
  }

  public async findOne({
    id,
    userId,
    gameId,
  }: IFindOnePlayerParams): Promise<IPlayer | undefined> {
    const foundPlayer = this.players.find(player => {
      if (id && player.id !== id) return false;
      if (userId && player.user.id !== userId) return false;
      if (gameId && player.game.id !== gameId) return false;

      return true;
    });

    return Promise.resolve(foundPlayer);
  }

  public async create({
    game,
    user,
    level,
    rank,
  }: CreatePlayerAdapter): Promise<IPlayer> {
    const player = new FakePlayer({ game, user, level, rank });

    this.players.push(player);

    return Promise.resolve(player);
  }

  public async update({
    id,
    experience,
    level,
    currentTitle,
    rank,
  }: UpdatePlayerAdapter): Promise<IPlayer> {
    const foundIndex = this.players.findIndex(
      storedPlayer => storedPlayer.id === id,
    );

    const foundPlayer = this.players[foundIndex];

    const updatedPlayer = {
      ...foundPlayer,
      experience,
      level,
      rank,
      currentTitle: new FakeTitle({ id: currentTitle }),
    };

    this.players[foundIndex] = updatedPlayer;

    return updatedPlayer;
  }

  public async addAchievement({
    id,
    achievement,
    title,
  }: AddAchievementToPlayerAdapter): Promise<IPlayer> {
    const foundIndex = this.players.findIndex(
      storedPlayer => storedPlayer.id === id,
    );

    const foundPlayer = this.players[foundIndex];
    foundPlayer.achievements.push(new FakeAchievement({ id: achievement }));
    if (title) foundPlayer.titles.push(new FakeTitle({ id: title }));

    this.players[foundIndex] = foundPlayer;

    return foundPlayer;
  }
}
