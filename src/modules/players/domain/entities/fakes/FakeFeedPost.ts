import { IFeedPost } from '@modules/players/domain/entities';
import FakePlayer from '@modules/players/domain/entities/fakes/FakePlayer';
import IPlayer from '@modules/players/domain/entities/IPlayer';
import { v4 as uuid } from 'uuid';

interface IConstructor {
  player?: string;
  game?: string;
  type?: IFeedPost['type'];
}

export default class FakeFeedPost implements IFeedPost {
  public id: string = uuid();
  public date: Date = new Date();
  public game: string;
  public type: IFeedPost['type'];
  public player: IPlayer;

  constructor({ player, game = uuid(), type = 'level' }: IConstructor = {}) {
    this.game = game;
    this.type = type;
    this.player = new FakePlayer({ id: player });
  }
}
