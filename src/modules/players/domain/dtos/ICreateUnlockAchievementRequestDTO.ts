export default interface ICreateUnlockAchievementRequestDTO {
  gameId: string;
  userId: string;
  requester: string;
  achievement: string;
  information?: string;
  requestDate: Date;
}
