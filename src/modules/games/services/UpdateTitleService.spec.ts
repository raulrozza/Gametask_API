import { RequestError } from '@shared/infra/errors';
import { v4 as uuid } from 'uuid';

import FakeTitle from '../fakes/FakeTitle';
import FakeTitlesRepository from '@modules/games/domain/repositories/fakes/FakeTitlesRepository';
import UpdateTitleService from './UpdateTitleService';

describe('UpdateTitleService', () => {
  it('should update the title correctly', async () => {
    const titlesRepository = new FakeTitlesRepository();
    const updateTitle = new UpdateTitleService(titlesRepository);

    const gameId = uuid();
    const fakeTitle = new FakeTitle(gameId);

    const title = await titlesRepository.create(fakeTitle);

    const updatedTitle = await updateTitle.execute({
      id: title.id,
      name: 'Random name',
      gameId,
    });

    expect(updatedTitle).not.toEqual(title);
  });

  it('should throw when trying to update a non existing title', async () => {
    const titlesRepository = new FakeTitlesRepository();
    const updateTitle = new UpdateTitleService(titlesRepository);

    const gameId = uuid();
    const fakeTitle = new FakeTitle(gameId);

    await expect(
      updateTitle.execute({
        gameId,
        ...fakeTitle,
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });
});
