import { v4 as uuid } from 'uuid';
import FakeTitle from '../fakes/FakeTitle';

import FakeTitlesRepository from '../repositories/fakes/FakeTitlesRepository';
import ListTitlesService from './ListTitlesService';
import { ITitle } from '../entities';

describe('ListTitlesService', () => {
  it('should list only the titles in a of a given game', async () => {
    const titlesRepository = new FakeTitlesRepository();

    const listTitles = new ListTitlesService(titlesRepository);

    const gameId = uuid();

    const fakeTitle = new FakeTitle(gameId);

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

    const fakeTitle1 = new FakeTitle(gameId);
    const fakeTitle2 = new FakeTitle(gameId);

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
