import { ILevelInfo, IRank } from '@shared/domain/entities';

interface IBaseConstructor {
  player: string;
  type: 'achievement' | 'activity' | 'level' | 'rank';
  game: string;
  activity?: string;
  achievement?: string;
  rank?: IRank;
  level?: ILevelInfo;
}

interface IActivityPostConstructor extends IBaseConstructor {
  type: 'activity';
  activity: string;
}

interface IAchievementPostConstructor extends IBaseConstructor {
  type: 'achievement';
  achievement: string;
}

interface ILevelPostConstructor extends IBaseConstructor {
  type: 'level';
  level: ILevelInfo;
}

interface IRankPostConstructor extends IBaseConstructor {
  type: 'rank';
  rank: IRank;
}

type IConstructor =
  | IActivityPostConstructor
  | IAchievementPostConstructor
  | ILevelPostConstructor
  | IRankPostConstructor;

export default class CreateFeedPostAdapter {
  public player: string;
  public type: 'achievement' | 'activity' | 'level' | 'rank';
  public activity?: string;
  public achievement?: string;
  public rank?: IRank;
  public level?: ILevelInfo;
  public game: string;
  public date: Date;

  constructor({
    player,
    type,
    game,
    activity,
    achievement,
    rank,
    level,
  }: IConstructor) {
    this.player = player;
    this.type = type;
    this.game = game;
    this.activity = activity;
    this.achievement = achievement;
    this.rank = rank;
    this.level = level;
    this.date = new Date();
  }
}
