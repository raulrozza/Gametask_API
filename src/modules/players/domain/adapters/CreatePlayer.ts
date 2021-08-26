import { ILevelInfo, IRank } from '@shared/domain/entities';

interface IConstructor {
  userId: string;
  gameId: string;
  gameLevels: ILevelInfo[];
  gameRanks: IRank[];
}

export default class CreatePlayerAdapter {
  public user: string;
  public game: string;
  public rank?: IRank;
  public level: number;

  constructor({ userId, gameId, gameLevels, gameRanks }: IConstructor) {
    this.user = userId;
    this.game = gameId;
    const level = this.getInitialLevel(gameLevels);
    this.level = level;
    this.rank = this.getInitialRank(gameRanks, level);
  }

  private getInitialLevel(levels: ILevelInfo[]): number {
    const sortedLevels = levels.sort(
      (a, b) => a.requiredExperience - b.requiredExperience,
    );

    const firstLevel = sortedLevels[0];

    if (!firstLevel) return 0;

    return firstLevel.level;
  }

  private getInitialRank(
    ranks: IRank[],
    initialLevel: number,
  ): IRank | undefined {
    if (!ranks.length) return;

    const crescentlySortedRanks = ranks.sort((a, b) => a.level - b.level);

    for (let i = 0; i < crescentlySortedRanks.length; i++) {
      const actualRank = crescentlySortedRanks[i];

      if (actualRank.level <= initialLevel) return actualRank;
    }
  }
}
