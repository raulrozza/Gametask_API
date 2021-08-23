import { IActivity } from '@modules/games/domain/entities';

interface IPossibleChanges {
  name: string;
  description?: string;
  experience: number;
  dmRules?: string;
}

interface IChanges extends IPossibleChanges {
  userId: string;
}

interface ILog {
  version: number;
  log: Date;
  changes: Partial<IPossibleChanges>;
  user: string;
}

export default class ActivityLog {
  private originalActivity: IActivity;
  public log: ILog;

  constructor(
    originalActivity: IActivity,
    { userId, name, description, dmRules, experience }: IChanges,
  ) {
    this.originalActivity = originalActivity;
    const changes = this.getChanges({ name, description, dmRules, experience });

    const logVersion = this.getLogVersion();

    this.log = {
      version: logVersion,
      log: new Date(),
      changes,
      user: userId,
    };
  }

  private getChanges({
    experience,
    name,
    description,
    dmRules,
  }: IPossibleChanges) {
    const changes: Partial<IPossibleChanges> = {};

    if (name !== this.originalActivity.name) changes.name = name;
    if (description !== this.originalActivity.description)
      changes.description = description;
    if (experience !== this.originalActivity.experience)
      changes.experience = experience;
    if (dmRules !== this.originalActivity.dmRules) changes.dmRules = dmRules;

    return changes;
  }

  private getLogVersion() {
    const existingLogVersion = this.originalActivity.changelog[0];

    if (existingLogVersion) return existingLogVersion.version + 1;

    return 1;
  }
}
