import User, { IUser } from '@models/User';
import bcrypt from 'bcryptjs';
import { JsonWebTokenError } from 'jsonwebtoken';
import {
  UserExistsError,
  errorCodes,
  MissingParametersError,
} from '@utils/Errors';
import { Request, Response } from 'express';

const BCRYPT_SALT_ROUNDS = 12; // salt rounds used in password crypto

// This controller manages the users in the application, creating and updating their data
export default {
  // The index method returns all instances of users
  async index(_: Request, res: Response) {
    try {
      const users = await User.find(
        {},
        {
          token: 0,
          password: 0,
        },
      );

      return res.json(users);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
  // The show method returns the data of a single user
  async show(req: Request, res: Response) {
    const { id } = req.params;

    try {
      if (!id)
        throw new MissingParametersError('Missing user id on parameters.');

      const user = await User.findById(id, {
        token: 0,
        password: 0,
      });

      return res.json(user);
    } catch (error) {
      if (error instanceof MissingParametersError)
        return res
          .status(400)
          .json({ error: error.message, code: errorCodes.MISSING_PARAMETERS });

      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
  // The store methods creates a new user
  async store(req: Request, res: Response) {
    const { firstname, lastname, email, password } = req.body;

    try {
      const hashedPassword = await bcrypt
        .hash(password, BCRYPT_SALT_ROUNDS)
        .catch(error => {
          throw error;
        });
      if (!hashedPassword)
        throw new JsonWebTokenError('Could not generate password');

      const foundUser = await User.findOne(
        {
          email,
        },
        {
          password: 0,
        },
      ).catch(error => {
        throw error;
      });

      if (foundUser) throw new UserExistsError('User already exists.');

      const user = await User.create<IUser>({
        firstname,
        lastname,
        email,
        password: hashedPassword,
      }).catch(error => {
        throw error;
      });

      return res.json(user);
    } catch (error) {
      if (error instanceof JsonWebTokenError)
        return res.status(500).json({ error: error.message });

      if (error instanceof UserExistsError)
        return res
          .status(400)
          .json({ error: error.message, code: errorCodes.USER_ALREADY_EXISTS });

      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
  async update(req: Request, res: Response) {
    const { firstname, lastname } = req.body;
    const { id } = req.auth;

    try {
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

      return res.status(201).send();
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
};
