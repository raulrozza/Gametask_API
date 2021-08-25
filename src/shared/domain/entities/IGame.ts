import { ILevelInfo, IRank, ITheme, IUser } from '@shared/domain/entities';

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
