import { ITitle } from '@modules/games/domain/entities';
import { ITitlesRepository } from '@modules/games/domain/repositories';
import ICreateTitleDTO from '@modules/games/domain/dtos/ICreateTitleDTO';
import { FakeTitle } from '@modules/games/domain/entities/fakes';
import UpdateTitleAdapter from '@modules/games/domain/adapters/UpdateTitle';

export default class FakeTitlesRepository implements ITitlesRepository {
  private readonly titles: ITitle[] = [];

  public async findAllFromGame(
    gameId: string,
    name?: string,
  ): Promise<ITitle[]> {
    return Promise.resolve(
      this.titles.filter(title => {
        if (!name) return title.game === gameId;

        return title.game === gameId && title.name.match(name);
      }),
    );
  }

  public async findOne(
    id: string,
    gameId: string,
  ): Promise<ITitle | undefined> {
    return Promise.resolve(
      this.titles.find(title => title.id === id && title.game === gameId),
    );
  }

  public async create({ name, game }: ICreateTitleDTO): Promise<ITitle> {
    const title = new FakeTitle({ name, game });

    this.titles.push(title);

    return Promise.resolve(title);
  }

  public async delete(titleId: string, gameId: string): Promise<void> {
    const foundIndex = this.titles.findIndex(
      title => title.id === titleId && title.game === gameId,
    );

    this.titles.splice(foundIndex, 1);
  }

  public async update({ id, ...title }: UpdateTitleAdapter): Promise<ITitle> {
    const foundIndex = this.titles.findIndex(
      storedTitle => storedTitle.id === id,
    );

    const foundTitle = this.titles[foundIndex];

    const updatedTitle = {
      ...foundTitle,
      ...title,
    };

    this.titles[foundIndex] = updatedTitle;

    return updatedTitle;
  }
}
