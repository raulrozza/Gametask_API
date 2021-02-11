import { IUser } from '@modules/users/entities';
import { ILevelInfo, IRank, ITheme } from '.';

export default interface IGame {
  id: string;
  name: string;
  description: string;
  theme?: ITheme;
  image?: string;
  administrators: string[] | IUser[];
  levelInfo: ILevelInfo[];
  newRegisters?: number;
  ranks: IRank[];
}
