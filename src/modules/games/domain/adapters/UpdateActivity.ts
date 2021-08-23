import ActivityLog from '@modules/games/domain/adapters/ActivityLog';
import IUpdateActivityDTO from '@modules/games/domain/dtos/IUpdateActivityDTO';

interface IConstructor extends Omit<IUpdateActivityDTO, 'userId'> {
  activityLog: ActivityLog;
}

export default class UpdateActivityAdapter {
  public id: string;
  public name: string;
  public description?: string;
  public experience: number;
  public dmRules?: string;
  public game: string;
  public changelog: ActivityLog['log'][] = [];
  public history = [];

  constructor({
    id,
    name,
    description,
    experience,
    dmRules,
    gameId,
    activityLog,
  }: IConstructor) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.experience = experience;
    this.dmRules = dmRules;
    this.game = gameId;

    const log = activityLog.log;
    this.changelog = [log];
  }
}
