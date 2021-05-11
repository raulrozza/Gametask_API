import { v4 as uuid } from 'uuid';
import { ITitle } from '@modules/games/entities';
import { ITitlesRepository } from '..';

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

  public async create(title: ITitle): Promise<ITitle> {
    title.id = uuid();

    this.titles.push(title);

    return Promise.resolve(title);
  }

  public async delete(titleId: string, gameId: string): Promise<void> {
    const foundIndex = this.titles.findIndex(
      title => title.id === titleId && title.game === gameId,
    );

    this.titles.splice(foundIndex, 1);
  }

  public async update({ id, ...title }: ITitle): Promise<ITitle> {
    const foundIndex = this.titles.findIndex(
      storedTitle => storedTitle.id === id && storedTitle.game === title.game,
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
