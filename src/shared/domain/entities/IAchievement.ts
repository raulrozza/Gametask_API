import { IGame } from '@modules/games/domain/entities';
import { ITitle } from '@shared/domain/entities';

export default interface IAchievement {
  id: string;
  name: string;
  description: string;
  title?: ITitle;
  image?: string;
  image_url?: string;
  game: IGame;
}
