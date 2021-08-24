import { IGame } from '@modules/games/domain/entities';
import { IGamesRepository } from '@modules/games/domain/repositories';
import CreateGameAdapter from '@modules/games/domain/adapters/CreateGame';
import { FakeGame } from '@modules/games/domain/entities/fakes';
import { FakeUser } from '@shared/domain/entities/fakes';
import { RequestError } from '@shared/infra/errors';
import errorCodes from '@config/errorCodes';
import UpdateGameAdapter from '@modules/games/domain/adapters/UpdateGameAdapter';

export default class FakeGamesRepository implements IGamesRepository {
  private readonly games: IGame[] = [];

  public async findAllFromUser(userId: string): Promise<IGame[]> {
    return Promise.resolve(
      this.games.filter(game => this.isAdminOf(game, userId)),
    );
  }

  public async findOne(
    id: string,
    userId?: string,
  ): Promise<IGame | undefined> {
    if (userId)
      return this.games.find(
        game => game.id === id && this.isAdminOf(game, userId),
      );

    return this.games.find(game => game.id === id);
  }

  public async create({
    name,
    description,
    administrators,
  }: CreateGameAdapter): Promise<IGame> {
    const fakeAdministrators = administrators.map(
      admin => new FakeUser({ id: admin }),
    );

    const game = new FakeGame({
      name,
      description,
      administrators: fakeAdministrators,
    });

    this.games.push(game);

    return Promise.resolve(game);
  }

  public async update({ id, ...game }: UpdateGameAdapter): Promise<IGame> {
    const foundIndex = this.games.findIndex(storedGame => storedGame.id === id);

    if (foundIndex < 0)
      throw new RequestError(
        'This game does not exist',
        errorCodes.BAD_REQUEST_ERROR,
      );

    const foundGame = this.games[foundIndex];

    const updatedGame = {
      ...foundGame,
      ...game,
    };

    this.games[foundIndex] = updatedGame;

    return updatedGame;
  }

  public async updateAvatar(id: string, image: string): Promise<IGame> {
    const foundIndex = this.games.findIndex(storedGame => storedGame.id === id);

    if (foundIndex < 0)
      throw new RequestError(
        'This game does not exist',
        errorCodes.BAD_REQUEST_ERROR,
      );

    const foundGame = this.games[foundIndex];

    const updatedGame: IGame = {
      ...foundGame,
      image,
    };

    this.games[foundIndex] = updatedGame;

    return updatedGame;
  }

  public async updateRegisters(id: string, increase: number): Promise<IGame> {
    const foundIndex = this.games.findIndex(storedGame => storedGame.id === id);

    if (foundIndex < 0)
      throw new RequestError(
        'This game does not exist',
        errorCodes.BAD_REQUEST_ERROR,
      );

    const foundGame = this.games[foundIndex];

    const updatedGame: IGame = {
      ...foundGame,
      newRegisters: Number(foundGame.newRegisters) + increase,
    };

    this.games[foundIndex] = updatedGame;

    return updatedGame;
  }

  private isAdminOf(game: IGame, userId: string): boolean {
    return Boolean(
      game.administrators.find(administrator => administrator.id === userId),
    );
  }
}
