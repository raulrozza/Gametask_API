const Player = require('../models/Player');

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
      return res.status(400).json({ error: String(error) });
    }
  },
  // The show method returns the data of a single player
  async show(req, res) {
    const { id } = req.params;
    const { id: user } = req.auth;
    const game = req.game;

    try {
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
      return res.status(400).json({ error: String(error) });
    }
  },
};
