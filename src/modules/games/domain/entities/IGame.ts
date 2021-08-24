import { IUser } from '@shared/domain/entities';
import { ILevelInfo, IRank, ITheme } from '.';

export default interface IGame {
  id: string;
  name: string;
  description: string;
  theme: ITheme;
  image?: string;
  image_url?: string;
  administrators: IUser[];
  levelInfo: ILevelInfo[];
  newRegisters: number;
  ranks: IRank[];
}
