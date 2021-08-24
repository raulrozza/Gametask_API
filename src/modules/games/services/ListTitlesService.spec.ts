import { v4 as uuid } from 'uuid';

import FakeTitlesRepository from '@modules/games/domain/repositories/fakes/FakeTitlesRepository';
import ListTitlesService from './ListTitlesService';
import { ITitle } from '@shared/domain/entities';
import { FakeTitle } from '@shared/domain/entities/fakes';

describe('ListTitlesService', () => {
  it('should list only the titles in a of a given game', async () => {
    const titlesRepository = new FakeTitlesRepository();

    const listTitles = new ListTitlesService(titlesRepository);

    const gameId = uuid();

    const fakeTitle = new FakeTitle({ game: gameId });

    await titlesRepository.create({
      game: fakeTitle.game,
      name: fakeTitle.name,
    } as ITitle);
    await titlesRepository.create({
      game: fakeTitle.game,
      name: fakeTitle.name,
    } as ITitle);
    await titlesRepository.create({
      game: 'not-my-game-id',
      name: fakeTitle.name,
    } as ITitle);

    const titles = await listTitles.execute({ gameId });

    expect(titles).toHaveLength(2);
  });

  it('should list only the corresponding title', async () => {
    const titlesRepository = new FakeTitlesRepository();

    const listTitles = new ListTitlesService(titlesRepository);

    const gameId = uuid();

    const fakeTitle1 = new FakeTitle({ game: gameId });
    const fakeTitle2 = new FakeTitle({ game: gameId });

    const title1 = await titlesRepository.create({
      game: fakeTitle1.game,
      name: fakeTitle1.name,
    } as ITitle);
    await titlesRepository.create({
      game: fakeTitle2.game,
      name: fakeTitle2.name,
    } as ITitle);

    const titles = await listTitles.execute({ gameId, name: title1.name });

    expect(titles).toHaveLength(1);
    expect(titles[0]).toEqual(title1);
  });
});
