import { ILevelInfo, ITheme } from '@modules/games/domain/entities';
import { IRank } from '@shared/domain/entities';

interface IConstructor {
  id: string;
  name: string;
  description: string;
  theme: ITheme;
  levelInfo: ILevelInfo[];
  ranks: IRank[];
}

export default class UpdateGameAdapter {
  public id: string;
  public name: string;
  public description: string;
  public theme: ITheme;
  public levelInfo: ILevelInfo[];
  public ranks: IRank[];

  constructor({
    id,
    name,
    description,
    theme,
    levelInfo,
    ranks,
  }: IConstructor) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.theme = theme;
    this.levelInfo = levelInfo;
    this.ranks = ranks;
  }
}
