import { Request, Response } from 'express';
import Achievement, {
  IAchievement,
  IAchievementDocument,
} from 'models/Achievement';
import { MongooseUpdateQuery } from 'mongoose';
import { MissingParametersError, errorCodes } from 'utils/Errors';

// This controller manages the achievements in the application, creating and updating their data
export default {
  // This method removes a achievement
  async delete(req: Request, res: Response) {
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
      console.error(error);

      if (error instanceof MissingParametersError)
        return res
          .status(400)
          .json({ error: error.message, code: errorCodes.MISSING_PARAMETERS });

      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
  // This method lists all achievements
  async index(req: Request, res: Response) {
    try {
      const achievements = await Achievement.find({ game: req.game })
        .populate('title')
        .catch(error => {
          throw error;
        });

      return res.json(achievements);
    } catch (error) {
      console.error(error);

      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
  // This method lists a single achievement
  async show(req: Request, res: Response) {
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
      console.error(error);

      if (error instanceof MissingParametersError)
        return res
          .status(400)
          .json({ error: error.message, code: errorCodes.MISSING_PARAMETERS });

      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
  // The store methods creates a new achievement
  async store(req: Request, res: Response) {
    const { name, description, title } = req.body;
    const filename = req.file ? req.file.filename : undefined;

    try {
      const achievement = await Achievement.create<
        Omit<IAchievementDocument, 'image_url'>
      >({
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
      console.error(error);

      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
  // This method updates a achievement
  async update(req: Request, res: Response) {
    const { name, description, title } = req.body;
    const { id } = req.params;

    try {
      if (!id)
        throw new MissingParametersError(
          'Missing achievement id on parameters.',
        );

      const hasTitle = title && title !== 'null' && title !== 'undefined';

      const set: Partial<IAchievement> = {};
      if (name) set.name = name;
      if (description) set.description = description;
      if (hasTitle) set.title = title;
      if (req.file) set.image = req.file.filename;

      const updateDocument: MongooseUpdateQuery<IAchievement> = {
        $set: set,
        $unset: hasTitle ? undefined : { title: '' },
      };

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
      console.error(error);

      if (error instanceof MissingParametersError)
        return res
          .status(400)
          .json({ error: error.message, code: errorCodes.MISSING_PARAMETERS });

      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
};
