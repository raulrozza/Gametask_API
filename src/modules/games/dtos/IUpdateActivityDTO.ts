export default interface IUpdateActivityDTO {
  gameId: string;
  userId: string;
  id: string;
  name: string;
  experience: number;
  description?: string;
  dmRules?: string;
}
