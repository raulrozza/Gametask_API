const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config/environment');
const { BadAuthenticationError, errorCodes } = require('../utils/Errors');

const VALID_DAYS = 7;

/*
  The Authentication Controller is responsible for the authentication methods. It's operations consists in returning the user trying to
  login, and also creating a login session in assossiation with an user
*/
module.exports = {
  // Create a user's session
  async store(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email }).catch(error => {
        throw error;
      });

      if (!user) throw new BadAuthenticationError();

      // bcrypt compares hashed password with inserted password
      const passwordMatch = await bcrypt
        .compare(password, user.password)
        .catch(error => {
          throw error;
        });

      if (!passwordMatch) throw new BadAuthenticationError();

      // Token expires in {VALID_DAYS} days. ExpiresIn takes on a number of seconds, so 60*60*24*VALID_DAYS
      const token = jwt.sign({ id: user._id, email }, SECRET_KEY, {
        expiresIn: VALID_DAYS * 86400,
      });
      if (!token) throw new jwt.JsonWebTokenError('Could not generate token.');

      await User.updateOne(
        {
          _id: user._id,
        },
        {
          $set: { token },
        },
      ).catch(error => {
        throw error;
      });

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
