import { RequestError } from '@shared/infra/errors';
import { v4 as uuid } from 'uuid';

import { FakeTitlesRepository } from '@shared/domain/repositories/fakes';
import UpdateTitleService from './UpdateTitleService';
import { FakeTitle } from '@shared/domain/entities/fakes';

describe('UpdateTitleService', () => {
  it('should update the title correctly', async () => {
    const titlesRepository = new FakeTitlesRepository();
    const updateTitle = new UpdateTitleService(titlesRepository);

    const gameId = uuid();
    const fakeTitle = new FakeTitle({ game: gameId });

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
    const fakeTitle = new FakeTitle({ game: gameId });

    await expect(
      updateTitle.execute({
        gameId,
        ...fakeTitle,
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });
});
