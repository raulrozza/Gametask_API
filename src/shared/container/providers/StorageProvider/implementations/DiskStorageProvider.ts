import fs from 'fs';
import path from 'path';
import uploadConfig from '@config/upload';
import IStorageProvider from '@shared/domain/providers/IStorageProvider';

export default class DiskStorageProvider implements IStorageProvider {
  public async saveFile(filename: string, filefolder: string): Promise<string> {
    await fs.promises.rename(
      path.resolve(uploadConfig.tmpPath, filename),
      path.resolve(uploadConfig.uploadsPath, filefolder, filename),
    );

    return filename;
  }

  public async deleteFile(filename: string, filefolder: string): Promise<void> {
    const filePath = path.resolve(
      uploadConfig.uploadsPath,
      filefolder,
      filename,
    );

    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}
