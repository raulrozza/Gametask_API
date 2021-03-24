import errorCodes from '@config/errorCodes';
import { RequestError } from '@shared/errors/implementations';
import mongoose from 'mongoose';
import ITransactionProvider, {
  SessionWorkflow,
} from '../models/ITransactionProvider';

export default class MongooseTransactionProvider
  implements ITransactionProvider {
  public async startSession<T>(
    sessionWorkflow: SessionWorkflow<T>,
  ): Promise<T> {
    let result: T;

    const session = await mongoose.startSession();

    let errorHappened = false;

    try {
      await session.startTransaction();

      result = await sessionWorkflow(session);

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();

      console.error(error.message);

      errorHappened = true;
    } finally {
      await session.endSession();
    }

    if (errorHappened)
      throw new RequestError(
        'An unknown error ocurred',
        errorCodes.INTERNAL_SERVER_ERROR,
        500,
      );

    return result;
  }
}
