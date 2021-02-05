import { container } from 'tsyringe';
import DiskStorageProvider from './implementations/DiskStorageProvider';

container.registerSingleton('StorageProvider', DiskStorageProvider);
