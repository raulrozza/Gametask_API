const mongoose = require('mongoose');
const Game = require('../models/Game');
const Player = require('../models/Player');

/* 
  This controller manages the game configurations
*/
module.exports = {
  // Retrieve the game's info
  async show(req, res) {
    const { id } = req.params;
    try {
      const game = await Game.findById(id)
        .populate('weeklyRanking.player', {
          experience: 0,
          achievements: 0,
          titles: 0,
        })
        .populate('weeklyRanking.player.user', {
          email: 0,
          auth: 0,
          password: 0,
          token: 0,
        });

      return res.json(game);
    } catch (error) {
      return res.status(400).json({ error: String(error) });
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
      let game;
      try {
        game = await Game.create(
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

      return res.json(game);
    } catch (error) {
      return res.status(400).json({ error: String(error) });
    }
  },
  // Update a game's setting
  async update(req, res) {
    const { name, description, theme } = req.body;
    const { id } = req.params;
    const { id: userId } = req.auth;

    try {
      const updateDocument = {};
      if (name) updateDocument.name = name;
      if (description) updateDocument.description = description;
      if (theme) updateDocument.theme = JSON.parse(theme);
      if (req.file) updateDocument.image = req.file.filename;

      const updateResponse = await Game.updateOne(
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

      return res.json(updateResponse);
    } catch (error) {
      return res.status(400).json({ error: String(error) });
    }
  },
};
