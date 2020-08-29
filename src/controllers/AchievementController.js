const Achievement = require('../models/Achievement');
const { MissingParametersError, errorCodes } = require('../utils/Errors');

// This controller manages the achievements in the application, creating and updating their data
module.exports = {
  // This method removes a achievement
  async delete(req, res) {
    const { id } = req.params;

    try {
      if (!id)
        throw new MissingParametersError(
          'Missing achievement id on parameters.',
        );

      const deleted = await Achievement.deleteOne({
        _id: id,
        game: req.game,
      }).catch(error => {
        throw error;
      });

      return res.json(deleted);
    } catch (error) {
      if (error instanceof MissingParametersError)
        return res
          .status(400)
          .json({ error: error.message, code: errorCodes.MISSING_PARAMETERS });

      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
  // This method lists all achievements
  async index(req, res) {
    try {
      const achievements = await Achievement.find({ game: req.game })
        .populate('title')
        .catch(error => {
          throw error;
        });

      return res.json(achievements);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
  // This method lists a single achievement
  async show(req, res) {
    const { id } = req.params;

    try {
      if (!id)
        throw new MissingParametersError(
          'Missing achievement id on parameters.',
        );

      const achievement = await Achievement.findById(id)
        .populate('title')
        .catch(error => {
          throw error;
        });

      return res.json(achievement);
    } catch (error) {
      if (error instanceof MissingParametersError)
        return res
          .status(400)
          .json({ error: error.message, code: errorCodes.MISSING_PARAMETERS });

      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
  // The store methods creates a new achievement
  async store(req, res) {
    const { name, description, title } = req.body;
    const filename = req.file ? req.file.filename : undefined;

    try {
      const achievement = await Achievement.create({
        name,
        description,
        title,
        game: req.game,
        image: filename,
      }).catch(error => {
        throw error;
      });

      return res.json(achievement);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
  // This method updates a achievement
  async update(req, res) {
    const { name, description, title } = req.body;
    const { id } = req.params;

    try {
      if (!id)
        throw new MissingParametersError(
          'Missing achievement id on parameters.',
        );

      const updateDocument = {
        $set: {},
      };
      if (name) updateDocument.$set.name = name;
      if (description) updateDocument.$set.description = description;
      if (title && title !== 'null' && title !== 'undefined')
        updateDocument.$set.title = title;
      else updateDocument.$unset = { title: '' };
      if (req.file) updateDocument.$set.image = req.file.filename;

      const achievement = await Achievement.updateOne(
        {
          _id: id,
          game: req.game,
        },
        updateDocument,
      ).catch(error => {
        throw error;
      });

      return res.json(achievement);
    } catch (error) {
      if (error instanceof MissingParametersError)
        return res
          .status(400)
          .json({ error: error.message, code: errorCodes.MISSING_PARAMETERS });

      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
};
