import request from 'supertest';

import { setEnvToTest } from '../helpers/setEnvToTest';
import app from '@shared/infra/http/app';

describe('Booting', () => {
  beforeAll(() => {
    setEnvToTest();
  });

  it('should receive the hello message from the api', async () => {
    const response = await request(app).get('/');

    expect(response.body).toHaveProperty('message');
  });

  it('should get a 404 message when trying to access an non existing resource', async () => {
    const response = await request(app).get('/this-resource-does-not-exist');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message');
  });
});
