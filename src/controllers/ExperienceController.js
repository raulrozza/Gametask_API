const mongoose = require('mongoose');
const Activity = require('../models/Activity');
const Game = require('../models/Game');
const User = require('../models/User');
const handleLevelUp = require('../actions/handleLevelUp');
const ActivityRegister = require('../models/ActivityRegister');
const handleRemoveActivityRegister = require('../actions/handleRemoveActivityRegister');

/* 
  This controller manages the game level info configuration
*/
module.exports = {
  async store(req, res) {
    const {
      userId,
      activityId,
      registerId,
      experience,
      completionDate,
    } = req.body;
    const game = req.game;

    try {
      const session = await mongoose.startSession();

      await session.startTransaction();

      try {
        // Register player acomplishment in the activity history
        const activityHistory = {
          user: userId,
          log: new Date(),
        };

        await Promise.all([
          // Give the player experience
          User.updateOne(
            { _id: userId },
            {
              $inc: {
                experience,
              },
            },
            {
              session,
            },
          ).then(() => {
            // Level up the player properly, getting the new level info
            handleLevelUp(userId, game, session);
          }),

          // Register in activity history
          Activity.updateOne(
            { _id: activityId },
            {
              $push: {
                history: {
                  $each: [activityHistory],
                  $position: 0,
                },
              },
            },
            {
              session,
            },
          ),
          // delete activity register
          handleRemoveActivityRegister(activityId, game, { session }),
        ]).catch(error => {
          throw mongoose.Error(error);
        });

        // add xp in the weekly ranking
        // add info in the item feed
      } catch (error) {
        console.error(error);
      }
      await session.abortTransaction();

      session.endSession();

      return res.json('opa');
    } catch (error) {
      return res.status(400).json({ error: String(error) });
    }
  },
};
