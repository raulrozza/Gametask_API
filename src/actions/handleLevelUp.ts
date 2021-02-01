import Player from '@models/Player';
import Game from '@models/Game';
import FeedItem, { IFeedItem } from '@models/FeedItem';
import { ClientSession, Types } from 'mongoose';
import { IRank } from '@models/utils/RankSchema';

export default async (
  playerId: Types.ObjectId,
  gameId: Types.ObjectId,
  session: ClientSession,
) => {
  const [player, game] = await Promise.all([
    Player.findById(playerId).session(session),
    Game.findById(gameId).session(session),
  ]);

  if (!game || !player) throw new Error();

  const sortedLevels = game.levelInfo.sort(
    (a, b) => b.requiredExperience - a.requiredExperience,
  );

  const higherLevel = sortedLevels.find(
    level => level.requiredExperience <= player.experience,
  );

  if (higherLevel && higherLevel.level > player.level) {
    // LEVEL UP!
    const newLevel = higherLevel.level;

    // Did the player rank up?
    const [newRank] = game.ranks
      .filter(
        rank => rank.level <= higherLevel.level && rank.level > player.level,
      )
      .sort((a, b) => b.level - a.level);

    interface SetDoc {
      level: number;
      rank?: IRank;
    }

    // The update document
    const playerSetDoc: SetDoc = {
      level: newLevel,
    };
    // If the player ranked up, set the new rank
    if (newRank) playerSetDoc.rank = newRank;

    // Update the player's level and rank
    await Player.updateOne(
      { _id: playerId },
      {
        $set: playerSetDoc,
      },
      { session },
    );

    // Create a level up notification
    await FeedItem.create(
      [
        {
          player: playerId,
          type: 'level',
          level: higherLevel,
          game: gameId,
          date: new Date(),
        },
      ],
      { session },
    );

    if (newRank) {
      // player got a new rank. Let's notify it
      await FeedItem.create<IFeedItem>(
        [
          {
            player: playerId,
            type: 'rank',
            rank: newRank,
            game: gameId,
            date: new Date(),
          },
        ],
        { session },
      );
    }
  }
};
