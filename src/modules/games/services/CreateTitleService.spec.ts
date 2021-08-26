import { v4 as uuid } from 'uuid';
import { FakeTitlesRepository } from '@shared/domain/repositories/fakes';
import CreateTitleService from './CreateTitleService';
import { FakeTitle } from '@shared/domain/entities/fakes';

describe('CreateTitleService', () => {
  it('should create the title', async () => {
    const titlesRepository = new FakeTitlesRepository();
    const createTitle = new CreateTitleService(titlesRepository);

    const gameId = uuid();

    const fakeTitle = new FakeTitle({ game: gameId });

    const payload = {
      name: fakeTitle.name,
      game: fakeTitle.game,
    };

    const title = await createTitle.execute(payload);

    expect(title).toHaveProperty('id');
    expect(title.name).toBe(fakeTitle.name);
    expect(title.game).toBe(fakeTitle.game);
  });
});
