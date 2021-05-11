import { container } from 'tsyringe';
import DiskStorageProvider from './StorageProvider/implementations/DiskStorageProvider';
import IStorageProvider from './StorageProvider/models/IStorageProvider';
import MongooseTransactionProvider from './TransactionProvider/implementations/MongooseTransactionProvider';
import ITransactionProvider from './TransactionProvider/models/ITransactionProvider';

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageProvider,
);
container.registerSingleton<ITransactionProvider>(
  'TransactionProvider',
  MongooseTransactionProvider,
);
