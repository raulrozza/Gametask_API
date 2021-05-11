import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

export default class AuthenticationController {
  public store: RequestHandler = async (request, response) => {
    const { email, password } = request.body;

    const authenticateUser = container.resolve(AuthenticateUserService);

    const authentication = await authenticateUser.execute({ email, password });

    return response.json(authentication);
  };
}
