const Game = require('../models/Game');
const ActivityRegister = require('../models/ActivityRegister');

// This controller manages the activities in the application, creating and updating their data
module.exports = {
  // This method lists all activity registers
  async index(_, res) {
    try {
      const activities = await ActivityRegister.find({})
        .populate('activity')
        .populate('requester')
        .sort({ requestDate: -1 })
        .catch(error => {
          throw error;
        });

      return res.json(activities);
    } catch (error) {
      return res.status(400).json({ error: String(error) });
    }
  },
  async delete(req, res) {
    const { id } = req.params;
    const game = req.game;

    try {
      await ActivityRegister.deleteOne({ _id: id });
      // Update registers on Game
      await Game.updateOne(
        { _id: game },
        {
          $inc: {
            newRegisters: -1,
          },
        },
      );
    } catch (error) {
      return res.status(400).json({ error: String(error) });
    }
  },
  // The store methods creates a new activity
  async store(req, res) {
    const {
      requester,
      activity,
      requestDate,
      completionDate,
      information,
    } = req.body;

    const game = req.game;

    try {
      // Create register
      const activityRegister = await ActivityRegister.create({
        requester,
        activity,
        requestDate,
        completionDate,
        information,
        game,
      }).catch(error => {
        throw error;
      });

      // Update registers on Game
      await Game.updateOne(
        { _id: game },
        {
          $inc: {
            newRegisters: 1,
          },
        },
      );

      return res.json(activityRegister);
    } catch (error) {
      return res.status(400).json({ error: String(error) });
    }
  },
};
