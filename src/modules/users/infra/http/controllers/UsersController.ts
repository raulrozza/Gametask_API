import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import {
  CreateUsersService,
  ListUsersService,
  ShowUsersService,
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

    return response.json(user);
  };

  public update: RequestHandler = async (request, response) => {
    /*  const { firstname, lastname } = req.body;
    const { id } = req.auth;

      interface UpdateDocument {
        firstname: string;
        lastname: string;
        image?: string;
      }

      const updateDocument: UpdateDocument = {
        firstname,
        lastname,
      };

      if (req.file) updateDocument.image = req.file.filename;

      await User.updateOne(
        {
          _id: id,
        },
        {
          $set: updateDocument,
        },
      ).catch(error => {
        throw error;
      });

      return res.status(201).send(); */
  };
}
