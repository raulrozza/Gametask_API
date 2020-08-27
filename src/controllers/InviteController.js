const { MissingParametersError, errorCodes } = require('../utils/Errors');
const Game = require('../models/Game');

module.exports = {
  async show(req, res) {
    const { gameId, inviter } = req.params;

    console.log(req.params);

    try {
      if (!gameId || !inviter)
        throw new MissingParametersError('Missing parameters');

      const game = await Game.findOne(
        {
          _id: gameId,
          administrators: inviter,
        },
        {
          image: 1,
          image_url: 1,
          name: 1,
          description: 1,
        },
      );

      return res.json(game);
    } catch (error) {
      if (error instanceof MissingParametersError)
        return res
          .status(400)
          .json({ error: error.message, code: errorCodes.MISSING_PARAMETERS });

      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
};
