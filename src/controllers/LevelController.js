const Game = require('../models/Game');

/* 
  This controller manages the game level info configuration
*/
module.exports = {
  async update(req, res) {
    const { levelInfo } = req.body;
    const { id } = req.params;

    try {
      const updateResponse = await Game.updateOne(
        {
          _id: id,
        },
        {
          $set: { levelInfo },
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
