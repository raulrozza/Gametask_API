import errorCodes from '@config/errorCodes';
import { RequestError } from '@shared/infra/errors';
import mongoose from 'mongoose';
import ITransactionProvider, {
  SessionWorkflow,
} from '@shared/domain/providers/ITransactionProvider';

export default class MongooseTransactionProvider
  implements ITransactionProvider {
  public async startSession<T>(
    sessionWorkflow: SessionWorkflow<T>,
  ): Promise<T> {
    const result: { data: T } = { data: null as any };

    const session = await mongoose.startSession();

    let errorHappened = false;

    try {
      await session.startTransaction();

      result.data = await sessionWorkflow(session);

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();

      console.error(error);

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

    return result.data;
  }
}
