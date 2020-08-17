const Game = require('../models/Game');

// This controller manages the ranks in the application, updating their data
module.exports = {
  // This method updates a rank
  async update(req, res) {
    const { ranks } = req.body;
    const { id } = req.params;
    const { id: userId } = req.auth;

    try {
      await Game.updateOne(
        {
          _id: id,
          administrators: userId,
        },
        {
          $set: { ranks },
        },
      ).catch(error => {
        throw error;
      });

      return res.status(201).send();
    } catch (error) {
      return res.status(400).json({ error: String(error) });
    }
  },
};
