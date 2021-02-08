import { IGame, ITitle } from '.';

export default interface IAchievement {
  id: string;
  name: string;
  description: string;
  title?: string | ITitle;
  image?: string;
  game: string | IGame;
}
