import { UpdateUserAvatarService } from '@modules/users/services';
import { RequestHandler } from 'express';
import { container } from 'tsyringe';

export default class UsersAvatarController {
  public update: RequestHandler = async (request, response) => {
    const file = request.file;
    const { id } = request.auth;

    const updateUserAvatar = container.resolve(UpdateUserAvatarService);

    const updatedUser = await updateUserAvatar.execute({
      filename: file.filename,
      id,
    });

    return response.status(201).json(updatedUser);
  };
}
