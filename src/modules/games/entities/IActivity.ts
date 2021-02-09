import { IGame, IHistory, IActivityLog } from '.';

export default interface IActivity {
  id: string;
  name: string;
  description?: string;
  experience: number;
  dmRules?: string;
  history?: IHistory[];
  changelog?: IActivityLog[];
  game: string | IGame;
}
