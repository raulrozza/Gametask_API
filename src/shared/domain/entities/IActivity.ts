import { IActivityLog, IHistory } from '@shared/domain/entities';
import IGame from '@shared/domain/entities/IGame';

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
