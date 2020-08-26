const FeedItem = require('../models/FeedItem');

// This controller manages the feeds in the application
module.exports = {
  // The index method returns all instances of feed registers
  async index(req, res) {
    try {
      const feed = await FeedItem.find({ game: req.game })
        .populate('player', {
          level: 1,
          currentTitle: 1,
          rank: 1,
        })
        .populate('player.user', {
          firstname: 1,
          lastname: 1,
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
      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
};
