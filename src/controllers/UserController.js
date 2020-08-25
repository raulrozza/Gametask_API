const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { JsonWebTokenError } = require('jsonwebtoken');
const { Error } = require('mongoose');
const { UserExistsError, errorCodes } = require('../utils/Errors');

const BCRYPT_SALT_ROUNDS = 12; // salt rounds used in password crypto

// This controller manages the users in the application, creating and updating their data
module.exports = {
  // The index method returns all instances of users
  async index(_, res) {
    try {
      const users = await User.find(
        {},
        {
          token: 0,
          password: 0,
        },
      ).catch(error => {
        throw error;
      });

      return res.json(users);
    } catch (error) {
      return res.status(400).json({ error: String(error) });
    }
  },
  // The show method returns the data of a single user
  async show(req, res) {
    const { id } = req.params;

    try {
      const user = await User.findById(id, {
        token: 0,
        password: 0,
      }).catch(error => {
        throw error;
      });

      return res.json(user);
    } catch (error) {
      return res.status(400).json({ error: String(error) });
    }
  },
  // The store methods creates a new user
  async store(req, res) {
    const { firstname, lastname, email, password } = req.body;

    try {
      const hashedPassword = await bcrypt
        .hash(password, BCRYPT_SALT_ROUNDS)
        .catch(error => {
          throw error;
        });
      if (!hashedPassword)
        throw JsonWebTokenError('Could not generate password');

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

      const user = await User.create({
        firstname,
        lastname,
        email,
        password: hashedPassword,
      }).catch(error => {
        throw error;
      });

      return res.json(user);
    } catch (error) {
      if (error instanceof JsonWebTokenError || error instanceof Error)
        return res.status(500).json({ error: error.message });

      if (error instanceof UserExistsError)
        return res
          .status(400)
          .json({ error: error.message, code: errorCodes.USER_ALREADY_EXISTS });

      return res.status(500).json({ error: 'Unknown error' });
    }
  },
};
