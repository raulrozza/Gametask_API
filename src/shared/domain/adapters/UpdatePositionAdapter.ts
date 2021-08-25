import { IPosition } from '@shared/domain/entities/ILeaderboard';

interface IToInsertPosition {
  player: string;
  experience: number;
}

interface IConstructor {
  leaderboardId: string;
  currentPositions: IPosition[];
  newPosition: IToInsertPosition;
}

export default class UpdatePositionAdapter {
  public leaderboardId: string;
  public positions: IToInsertPosition[];

  constructor({ leaderboardId, currentPositions, newPosition }: IConstructor) {
    this.leaderboardId = leaderboardId;

    const playerIndex = this.getPlayerIndexInPosition(
      currentPositions,
      newPosition.player,
    );

    if (playerIndex < 0) {
      this.positions = this.createUpdatedPositionsWithNewPlayer(
        currentPositions,
        newPosition,
      );

      return;
    }

    this.positions = this.createPositionsWithAdditionalExperienceForPlayer(
      currentPositions,
      playerIndex,
      newPosition.experience,
    );
  }

  private getPlayerIndexInPosition(positions: IPosition[], id: string) {
    return positions.findIndex(position => position.player.id === id);
  }

  private createUpdatedPositionsWithNewPlayer(
    positions: IPosition[],
    playerInfo: IToInsertPosition,
  ) {
    const updatedPositions: IToInsertPosition[] = positions.map(position => ({
      player: position.player.id,
      experience: position.experience,
    }));

    updatedPositions.push(playerInfo);

    return updatedPositions;
  }

  private createPositionsWithAdditionalExperienceForPlayer(
    positions: IPosition[],
    index: number,
    newExperience: number,
  ) {
    const updatedPositions: IToInsertPosition[] = positions.map(position => ({
      player: position.player.id,
      experience: position.experience,
    }));

    positions[index].experience += newExperience;

    return updatedPositions;
  }
}
