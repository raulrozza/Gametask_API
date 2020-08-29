const Player = require('../models/Player');
const { MissingParametersError, errorCodes } = require('../utils/Errors');

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
      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
  // Retrieve the info of a player, with his game's stored info
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
      }).populate('game');

      return res.json(player);
    } catch (error) {
      if (error instanceof MissingParametersError)
        return res
          .status(400)
          .json({ error: error.message, code: errorCodes.MISSING_PARAMETERS });

      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
};
