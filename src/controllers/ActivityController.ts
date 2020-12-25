import { Request, Response } from 'express';
import Activity, { IActivity } from 'models/Activity';
import {
  MissingParametersError,
  errorCodes,
  BadRequestError,
} from 'utils/Errors';

// This controller manages the activities in the application, creating and updating their data
export default {
  // This method removes an activity
  async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const deleted = await Activity.deleteOne({
        _id: id,
        game: req.game,
      }).catch(error => {
        throw error;
      });

      return res.json(deleted);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
  // This method lists all activities
  async index(req: Request, res: Response) {
    try {
      const activities = await Activity.find({ game: req.game }).catch(
        error => {
          throw error;
        },
      );

      return res.json(activities);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
  // This method returns one activities info
  async show(req: Request, res: Response) {
    const { id } = req.params;

    try {
      if (!id)
        throw new MissingParametersError('Missing activity id on parameters.');

      const activity = await Activity.findById(id).catch(error => {
        throw error;
      });

      return res.json(activity);
    } catch (error) {
      if (error instanceof MissingParametersError)
        return res
          .status(400)
          .json({ error: error.message, code: errorCodes.MISSING_PARAMETERS });

      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
  // The store methods creates a new activity
  async store(req: Request, res: Response) {
    const { name, description, experience, dmRules } = req.body;

    try {
      const activity = await Activity.create<IActivity>({
        name,
        description,
        experience,
        dmRules,
        game: req.game,
      }).catch(error => {
        throw error;
      });

      return res.json(activity);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
  // This method updates an activity
  async update(req: Request, res: Response) {
    const { name, description, experience, dmRules } = req.body;
    const { id } = req.params;

    try {
      if (!id)
        throw new MissingParametersError('Missing activity id on parameters.');

      const activity = await Activity.findById(id);

      if (!activity) throw new BadRequestError();

      const changelog = {
        version: activity.changelog[0] ? activity.changelog[0].version + 1 : 1,
        log: new Date(),
        changes: {
          name: activity.name,
          description: activity.description,
          experience: activity.experience,
          dmRules: activity.dmRules,
        },
        userId: req.auth.id,
      };

      const updateDocument = {
        name,
        description,
        experience,
        dmRules,
      };

      await Activity.updateOne(
        {
          _id: id,
          game: req.game,
        },
        {
          $set: updateDocument,
          $push: {
            changelog: {
              $each: [changelog],
              $position: 0,
            },
          },
        },
      ).catch(error => {
        throw error;
      });

      return res.status(201).send();
    } catch (error) {
      if (error instanceof MissingParametersError)
        return res
          .status(400)
          .json({ error: error.message, code: errorCodes.MISSING_PARAMETERS });
      if (error instanceof BadRequestError)
        return res
          .status(400)
          .json({ error: error.message, code: errorCodes.BAD_REQUEST_ERROR });

      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
};