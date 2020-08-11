const Title = require('../models/Title');

// This controller manages the titles in the application, creating and updating their data
module.exports = {
  // This method removes a title
  async delete(req, res) {
    const { id } = req.params;

    try {
      const deleted = await Title.deleteOne({
        _id: id,
        game: req.game,
      }).catch(error => {
        throw error;
      });

      return res.json(deleted);
    } catch (error) {
      return res.status(400).json({ error: String(error) });
    }
  },
  // This method lists all titles
  async index(req, res) {
    const { name } = req.query;
    try {
      const queryDocument = { game: req.game };
      if (name) queryDocument.name = { $regex: `^${name}`, $options: 'i' };

      const titles = await Title.find(queryDocument).catch(error => {
        throw error;
      });

      return res.json(titles);
    } catch (error) {
      return res.status(400).json({ error: String(error) });
    }
  },
  // The store methods creates a new title
  async store(req, res) {
    const { name } = req.body;

    try {
      const title = await Title.create({
        name,
        game: req.game,
      }).catch(error => {
        throw error;
      });

      return res.json(title);
    } catch (error) {
      return res.status(400).json({ error: String(error) });
    }
  },
  // This method updates a title
  async update(req, res) {
    const { name } = req.body;
    const { id } = req.params;

    try {
      const title = await Title.updateOne(
        {
          _id: id,
          game: req.game,
        },
        {
          $set: {
            name,
          },
        },
      ).catch(error => {
        throw error;
      });

      return res.json(title);
    } catch (error) {
      return res.status(400).json({ error: String(error) });
    }
  },
};
