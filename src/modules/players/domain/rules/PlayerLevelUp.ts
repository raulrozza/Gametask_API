import { ILevelInfo, IRank } from '@shared/domain/entities';

interface IConstructor {
  player: {
    rank?: IRank;
    level: number;
    experience: number;
  };
  game: {
    ranks: IRank[];
    levelInfo: ILevelInfo[];
  };
  activity: {
    experience: number;
  };
}

export default class PlayerLevelUp {
  public experience: number;
  public level: number;
  public rank?: IRank;

  public nextLevel?: ILevelInfo;
  public hasLeveledUp = false;
  public gotNewRank = false;

  constructor({ player, game, activity }: IConstructor) {
    this.experience = player.experience + activity.experience;
    this.level = player.level;
    this.rank = player.rank;

    this.nextLevel = this.getPlayerNextLevel(this.experience, game.levelInfo);

    if (this.hasNotLeveledUp(player.level, this.nextLevel)) return;
    this.level = this.nextLevel.level;
    this.hasLeveledUp = true;

    const newRank = this.getNewRank(game.ranks, this.level);
    if (newRank) {
      this.rank = newRank;
      this.gotNewRank = true;
    }
  }

  private getPlayerNextLevel(
    currentExperience: number,
    levels: ILevelInfo[],
  ): ILevelInfo | undefined {
    const levelsSortedByHigherExperience = levels.sort(
      (a, b) => b.requiredExperience - a.requiredExperience,
    );

    const nextObtainableLevel = levelsSortedByHigherExperience.find(
      level => level.requiredExperience <= currentExperience,
    );

    return nextObtainableLevel;
  }

  private hasNotLeveledUp(
    playerLevel: number,
    nextLevel?: ILevelInfo,
  ): nextLevel is undefined {
    return !nextLevel || nextLevel.level <= playerLevel;
  }

  private getNewRank(ranks: IRank[], playerLevel: number): IRank | undefined {
    const obtainableRanks = ranks.filter(rank => rank.level <= playerLevel);
    const ranksSortedByHigherLevel = obtainableRanks.sort(
      (a, b) => b.level - a.level,
    );

    const [possibleNewRank] = ranksSortedByHigherLevel;

    return possibleNewRank;
  }
}
