const Game = require('../models/Game');
const { MissingParametersError, errorCodes } = require('../utils/Errors');

/* 
  This controller manages the game level info configuration
*/
module.exports = {
  async update(req, res) {
    const { levelInfo } = req.body;
    const { id } = req.params;
    const { id: userId } = req.auth;

    try {
      if (!id)
        throw new MissingParametersError('Missing game id on parameters.');

      await Game.updateOne(
        {
          _id: id,
          administrators: userId,
        },
        {
          $set: { levelInfo },
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
