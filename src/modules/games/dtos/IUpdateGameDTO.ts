import { ILevelInfo, IRank, ITheme } from '../entities';

export default interface IUpdateGameDTO {
  adminId: string;
  id: string;
  name: string;
  description: string;
  theme: ITheme;
  levelInfo: ILevelInfo[];
  ranks: IRank[];
}
