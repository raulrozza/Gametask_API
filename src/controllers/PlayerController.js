const mongoose = require('mongoose');
const Player = require('../models/Player');
const { errorCodes, MissingParametersError } = require('../utils/Errors');
const handleLevelUp = require('../actions/handleLevelUp');

// This controller manages the players in the application, managing their data
module.exports = {
  // The index method returns all instances of players in a game
  async index(req, res) {
    try {
      const players = await Player.find({
        game: req.game,
      }).populate('user', {
        firstname: 1,
        lastname: 1,
        image: 1,
        profile_url: 1,
      });

      return res.json(players);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
  // The show method returns the data of a single player
  async show(req, res) {
    const { id } = req.params;
    const { id: user } = req.auth;
    const game = req.game;

    try {
      if (!id)
        throw new MissingParametersError('Missing player id on parameters.');

      const player = await Player.findOne({
        _id: id,
        user,
        game,
      }).populate('user', {
        firstname: 1,
        lastname: 1,
        image: 1,
        profile_url: 1,
      });

      return res.json(player);
    } catch (error) {
      if (error instanceof MissingParametersError)
        return res
          .status(400)
          .json({ error: error.message, code: errorCodes.MISSING_PARAMETERS });

      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
  // This method creates a new player, assigning a user to a game
  async store(req, res) {
    const { game } = req.body;
    const { id } = req.auth;

    try {
      const player = await Player.create({
        user: id,
        game,
      });

      const session = await mongoose.startSession().catch(error => {
        throw error;
      });

      await session.startTransaction();

      try {
        await handleLevelUp(player._id, game, session);
        await session.commitTransaction();
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }

      res.status(201).json(player._id);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
  async update(req, res) {
    const { currentTitle } = req.body;
    const { id } = req.params;
    const { id: user } = req.auth;
    const game = req.game;

    try {
      if (!id)
        throw new MissingParametersError('Missing player id on parameters.');

      const updateDocument = {
        currentTitle,
      };

      await Player.updateOne(
        {
          _id: id,
          user,
          game,
        },
        {
          $set: updateDocument,
        },
      );

      return res.status(201).send();
    } catch (error) {
      if (error instanceof MissingParametersError)
        return res
          .status(400)
          .json({ error: error.message, code: errorCodes.MISSING_PARAMETERS });

      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
};
