import { IFeedPost } from '@modules/players/domain/entities';
import FakePlayer from '@modules/players/domain/entities/fakes/FakePlayer';
import IPlayer from '@modules/players/domain/entities/IPlayer';
import {
  IAchievement,
  IActivity,
  ILevelInfo,
  IRank,
} from '@shared/domain/entities';
import { FakeAchievement, FakeActivity } from '@shared/domain/entities/fakes';
import { v4 as uuid } from 'uuid';

interface IConstructor {
  player?: string;
  game?: string;
  type?: IFeedPost['type'];
  date?: Date;
  achievement?: string;
  activity?: string;
  rank?: IRank;
  level?: ILevelInfo;
}

export default class FakeFeedPost implements IFeedPost {
  public id: string = uuid();
  public date: Date;
  public game: string;
  public type: IFeedPost['type'];
  public player: IPlayer;
  public achievement?: IAchievement;
  public activity?: IActivity;
  public rank?: IRank;
  public level?: ILevelInfo;

  constructor({
    player,
    game = uuid(),
    type = 'level',
    date = new Date(),
    achievement,
    activity,
    rank,
    level,
  }: IConstructor = {}) {
    this.game = game;
    this.type = type;
    this.player = new FakePlayer({ id: player });
    this.date = date;
    this.achievement = achievement
      ? new FakeAchievement({ id: achievement })
      : undefined;
    this.activity = activity ? new FakeActivity({ id: activity }) : undefined;
    this.rank = rank;
    this.level = level;
  }
}
