export default interface IStorageProvider {
  saveFile(filename: string, filefolder: string): Promise<string>;
  deleteFile(filename: string, filefolder: string): Promise<void>;
}
