import { IGame } from '@modules/games/domain/entities';
import { IActivityLog, IHistory } from '@shared/domain/entities';

export default interface IActivity {
  id: string;
  name: string;
  description?: string;
  experience: number;
  dmRules?: string;
  history: IHistory[];
  changelog: IActivityLog[];
  game: IGame;
}
