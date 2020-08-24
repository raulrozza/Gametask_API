const Player = require('../models/Player');

/* 
  This controller manages gameplay actions, such as listing all games to a player
*/
module.exports = {
  // Retrieve all games registered by a certain player
  async index(req, res) {
    const { id } = req.auth;
    try {
      const games = await Player.find({
        user: id,
      }).populate('game');

      return res.json(games);
    } catch (error) {
      return res.status(400).json({ error: String(error) });
    }
  },
};
