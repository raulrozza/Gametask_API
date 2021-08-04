import request from 'supertest';

import resetMongoDatabase from '../helpers/resetMongoDatabase';
import { setEnvToTest } from '../helpers/setEnvToTest';

import app from '@shared/infra/http/app';
import * as mongoEntities from '@modules/users/infra/mongoose/entities';
import FakeUser from '@modules/users/domain/entities/fakes/FakeUser';

describe('Users', () => {
  beforeAll(async () => {
    setEnvToTest();
    const entitiesArray = Object.values(mongoEntities);
    await resetMongoDatabase(entitiesArray);
  });

  jest.setTimeout(10000);

  const myUser = new FakeUser();
  const auth = { token: undefined };

  it('should create a new user', async () => {
    const requestBody = {
      firstname: myUser.firstname,
      lastname: myUser.lastname,
      email: myUser.email,
      password: myUser.password,
    };

    const response = await request(app).post('/users/signup').send(requestBody);

    const resultUser = response.body;

    expect(resultUser).toHaveProperty('id');
    expect(resultUser.firstname).toBe(myUser.firstname);
    expect(resultUser.lastname).toBe(myUser.lastname);
    expect(resultUser.email).toBe(myUser.email);

    myUser.id = resultUser.id;
  });

  it('should login with the newly created user', async () => {
    const requestBody = {
      email: myUser.email,
      password: myUser.password,
    };

    const response = await request(app).post('/users/login').send(requestBody);

    const authResponse = response.body;

    expect(authResponse).toHaveProperty('token');

    auth.token = authResponse.token;
  });

  it('should retreive the logged users info', async () => {
    const response = await request(app)
      .get(`/users/${myUser.id}`)
      .set('authorization', `Bearer ${auth.token}`);

    const user = response.body;

    expect(user.firstname).toBe(myUser.firstname);
    expect(user.lastname).toBe(myUser.lastname);
    expect(user.email).toBe(myUser.email);
  });

  it('should update the user firstname and lastname', async () => {
    myUser.firstname = 'new name';
    myUser.lastname = 'new lastname';

    const requestBody = {
      firstname: myUser.firstname,
      lastname: myUser.lastname,
    };

    const response = await request(app)
      .put('/users')
      .set('authorization', `Bearer ${auth.token}`)
      .send(requestBody);

    const updatedUser = response.body;

    expect(updatedUser.firstname).toBe(myUser.firstname);
    expect(updatedUser.lastname).toBe(myUser.lastname);
  });
});
