import { v4 as uuid } from 'uuid';
import FakeTitle from '../fakes/FakeTitle';
import FakeTitlesRepository from '../repositories/fakes/FakeTitlesRepository';
import CreateTitleService from './CreateTitleService';

describe('CreateTitleService', () => {
  it('should create the title', async () => {
    const titlesRepository = new FakeTitlesRepository();
    const createTitle = new CreateTitleService(titlesRepository);

    const gameId = uuid();

    const fakeTitle = new FakeTitle(gameId);

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
