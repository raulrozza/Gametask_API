import User from '@models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '@config/environment';
import { BadAuthenticationError, errorCodes } from '@utils/Errors';
import { Request, Response } from 'express';

const VALID_DAYS = 7;

/*
  The Authentication Controller is responsible for the authentication methods. It's operations consists in returning the user trying to
  login, and also creating a login session in assossiation with an user
*/
export default {
  // Create a user's session
  async store(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) throw new BadAuthenticationError();

      // bcrypt compares hashed password with inserted password
      const passwordMatch = await bcrypt
        .compare(password, user.password)
        .catch(error => {
          throw error;
        });

      if (!passwordMatch) throw new BadAuthenticationError();

      // Token expires in {VALID_DAYS} days. ExpiresIn takes on a number of seconds, so 60*60*24*VALID_DAYS
      const token = jwt.sign(
        { id: user._id, email },
        String(config.SECRET_KEY),
        {
          expiresIn: VALID_DAYS * 86400,
        },
      );
      if (!token) throw new jwt.JsonWebTokenError('Could not generate token.');

      await User.updateOne(
        {
          _id: user._id,
        },
        {
          $set: { token },
        },
      );

      user.token = token;

      return res.json(user);
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError)
        return res.status(500).json({ error: error.message });

      if (error instanceof BadAuthenticationError)
        return res.status(400).json({
          error: "User and password don't match.",
          code: errorCodes.USER_PASSWORD_DONT_MATCH,
        });

      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
};
