const Game = require('../models/Game');
const ActivityRegister = require('../models/ActivityRegister');

// This controller manages the activities in the application, creating and updating their data
module.exports = {
  // This method lists all activity registers
  async index(_, res) {
    try {
      const activities = await ActivityRegister.find({}).catch(error => {
        throw error;
      });

      return res.json(activities);
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
      gameId,
    } = req.body;

    try {
      // Create register
      const activityRegister = await ActivityRegister.create({
        requester,
        activity,
        requestDate,
        completionDate,
        information,
      }).catch(error => {
        throw error;
      });

      // Update registers on Game
      await Game.updateOne(gameId, {
        $inc: {
          newRegisters: 1,
        },
      });

      return res.json(activityRegister);
    } catch (error) {
      return res.status(400).json({ error: String(error) });
    }
  },
};
