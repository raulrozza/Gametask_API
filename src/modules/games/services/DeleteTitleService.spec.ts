import { v4 as uuid } from 'uuid';

import { FakeTitle } from '../fakes';
import { ITitle } from '../entities';
import FakeTitlesRepository from '@modules/games/domain/repositories/fakes/FakeTitlesRepository';
import DeleteTitleService from './DeleteTitleService';

describe('DeleteTitleService', () => {
  it('should delete the right title', async () => {
    const titlesRepository = new FakeTitlesRepository();
    const deleteTitle = new DeleteTitleService(titlesRepository);

    const gameId = uuid();
    const fakeTitle = new FakeTitle(gameId);

    await titlesRepository.create({
      game: fakeTitle.game,
      name: fakeTitle.name,
    } as ITitle);
    const titleToBeDeleted = await titlesRepository.create({
      game: fakeTitle.game,
      name: fakeTitle.name,
    } as ITitle);
    await titlesRepository.create({
      game: fakeTitle.game,
      name: fakeTitle.name,
    } as ITitle);

    await deleteTitle.execute({ gameId, titleId: titleToBeDeleted.id });

    const titles = await titlesRepository.findAllFromGame(gameId);

    expect(titles).toHaveLength(2);
    expect(titles).not.toContainEqual(titleToBeDeleted);
  });
});
