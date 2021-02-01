import { Request, Response } from 'express';
import FeedItem from '@models/FeedItem';

// This controller manages the feeds in the application
export default {
  // The index method returns all instances of feed registers
  async index(req: Request, res: Response) {
    try {
      const feed = await FeedItem.find({ game: req.game })
        .populate({
          path: 'player',
          select: '_id level currentTitle rank',
          populate: [
            {
              path: 'user',
              select: 'firstname lastname image profile_url',
            },
            {
              path: 'currentTitle',
            },
          ],
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
