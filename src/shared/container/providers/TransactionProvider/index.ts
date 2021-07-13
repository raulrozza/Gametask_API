import MongooseTransactionProvider from '@shared/container/providers/TransactionProvider/implementations/MongooseTransactionProvider';
import ITransactionProvider from '@shared/container/providers/TransactionProvider/models/ITransactionProvider';
import { container } from 'tsyringe';

container.registerSingleton<ITransactionProvider>(
  'TransactionProvider',
  MongooseTransactionProvider,
);
