import { ILevelInfo, ITheme } from '@modules/games/domain/entities';
import { IRank } from '@shared/domain/entities';

export default interface IUpdateGameDTO {
  adminId: string;
  id: string;
  name: string;
  description: string;
  theme: ITheme;
  levelInfo: ILevelInfo[];
  ranks: IRank[];
}
