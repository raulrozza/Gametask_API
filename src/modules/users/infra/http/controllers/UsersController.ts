import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import {
  CreateUsersService,
  ListUsersService,
  ShowUsersService,
  UpdateUserService,
} from '@modules/users/services';

export default class UsersController {
  public index: RequestHandler = async (_, response) => {
    const listUsers = container.resolve(ListUsersService);

    const users = await listUsers.execute();

    return response.json(users);
  };

  public show: RequestHandler = async (request, response) => {
    const { id } = request.params;

    const showUsers = container.resolve(ShowUsersService);

    const user = await showUsers.execute(id);

    return response.json(user);
  };

  public store: RequestHandler = async (request, response) => {
    const { firstname, lastname, email, password } = request.body;

    const createUser = container.resolve(CreateUsersService);

    const user = await createUser.execute({
      firstname,
      lastname,
      email,
      password,
    });

    return response.status(201).json(user);
  };

  public update: RequestHandler = async (request, response) => {
    const { firstname, lastname } = request.body;
    const { id } = request.auth;

    const updateUser = container.resolve(UpdateUserService);

    const user = await updateUser.execute({ firstname, lastname, id });

    return response.status(201).json(user);
  };
}
