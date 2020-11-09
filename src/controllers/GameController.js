const mongoose = require('mongoose');
const Game = require('../models/Game');
const Player = require('../models/Player');
const { MissingParametersError, errorCodes } = require('../utils/Errors');

/* 
  This controller manages the game configurations
*/
module.exports = {
  // Retrieve all games that belong to a certain user
  async index(req, res) {
    const { id } = req.auth;
    try {
      const games = await Game.find({
        administrators: id,
      }).populate({
        path: 'weeklyRanking',
        populate: {
          path: 'player',
          select: 'level rank currentTitle user _id',
          populate: {
            path: 'currentTitle',
          },
        },
      });

      return res.json(games);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
  // Retrieve the game's info
  async show(req, res) {
    const { id } = req.params;

    try {
      if (!id)
        throw new MissingParametersError('Missing game id on parameters.');

      const game = await Game.findById(id).populate({
        path: 'weeklyRanking',
        populate: {
          path: 'player',
          select: 'level rank currentTitle user _id',
          populate: [
            {
              path: 'user',
              select: '_id firstname lastname image profile_url',
            },
            {
              path: 'currentTitle',
            },
          ],
        },
      });

      return res.json(game);
    } catch (error) {
      if (error instanceof MissingParametersError)
        return res
          .status(400)
          .json({ error: error.message, code: errorCodes.MISSING_PARAMETERS });

      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
  // Create a game's initial config
  async store(req, res) {
    const { name, description, theme, levelInfo } = req.body;
    const { filename } = req.file;
    const { id } = req.auth;

    try {
      const session = await mongoose.startSession().catch(error => {
        throw error;
      });

      await session.startTransaction();

      try {
        const [game] = await Game.create(
          [
            {
              name,
              description,
              theme,
              image: filename,
              administrators: [id],
              levelInfo,
            },
          ],
          { session },
        );

        await Player.create({
          user: id,
          game: game._id,
        });

        await session.commitTransaction();
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }

      return res.status(201).send();
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
  // Update a game's setting
  async update(req, res) {
    const { name, description, theme } = req.body;
    const { id } = req.params;
    const { id: userId } = req.auth;

    try {
      if (!id)
        throw new MissingParametersError('Missing game id on parameters.');

      const updateDocument = {};
      if (name) updateDocument.name = name;
      if (description) updateDocument.description = description;
      if (theme) updateDocument.theme = JSON.parse(theme);
      if (req.file) updateDocument.image = req.file.filename;

      await Game.updateOne(
        {
          _id: id,
          administrators: userId,
        },
        {
          $set: updateDocument,
        },
      ).catch(error => {
        throw error;
      });

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
