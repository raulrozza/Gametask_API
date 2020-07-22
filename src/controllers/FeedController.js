const FeedItem = require('../models/FeedItem');

// This controller manages the feeds in the application
module.exports = {
  // The index method returns all instances of feed registers
  async index(_, res) {
    try {
      const feed = await FeedItem.find({})
        .populate('user', {
          firstname: 1,
          lastname: 1,
          level: 1,
          currentTitle: 1,
          image: 1,
          profile_url: 1,
        })
        .populate('activity', {
          name: 1,
          experience: 1,
        })
        .populate('achievement', {
          name: 1,
          title: 1,
        })
        .sort({
          date: -1,
        });

      return res.json(feed);
    } catch (error) {
      return res.status(400).json({ error: String(error) });
    }
  },
};
