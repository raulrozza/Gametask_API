import { Request, Response } from 'express';
import Player from '@models/Player';
import Title from '@models/Title';
import { Types } from 'mongoose';
import {
  MissingParametersError,
  errorCodes,
  TitleBelongsToPlayerError,
} from '@utils/Errors';

// This controller manages the titles in the application, creating and updating their data
export default {
  // This method removes a title
  async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      if (!id)
        throw new MissingParametersError('Missing title id in parameters.');

      const playersWithTitle = await Player.find({
        titles: id,
      });

      if (playersWithTitle.length > 0)
        throw new TitleBelongsToPlayerError(
          'This title was already obtained by someone.',
        );

      await Title.deleteOne({
        _id: id,
        game: req.game,
      }).catch(error => {
        throw error;
      });

      return res.status(201).send();
    } catch (error) {
      if (error instanceof MissingParametersError)
        return res
          .status(400)
          .json({ error: error.message, code: errorCodes.MISSING_PARAMETERS });

      if (error instanceof TitleBelongsToPlayerError)
        return res.status(400).json({
          error: error.message,
          code: errorCodes.TITLE_BELONGS_TO_PLAYER,
        });

      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
  // This method lists all titles
  async index(req: Request, res: Response) {
    const { name } = req.query;

    try {
      interface QueryDocument {
        game: Types.ObjectId;
        name?: Object;
      }

      const queryDocument: QueryDocument = { game: req.game };
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
  async store(req: Request, res: Response) {
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
      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
  // This method updates a title
  async update(req: Request, res: Response) {
    const { name } = req.body;
    const { id } = req.params;

    try {
      if (!id)
        throw new MissingParametersError('Title id is missing in parameters.');

      await Title.updateOne(
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

      return res.status(201).send();
    } catch (error) {
      if (error instanceof MissingParametersError)
        return res
          .status(400)
          .json({ error: error.message, code: errorCodes.MISSING_PARAMETERS });

      return res.status(500).json({ error: 'Internal server error.' });
    }
  },
};
