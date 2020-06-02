const Game = require('../models/Game');

/* 
  This controller manages the game configurations
*/
module.exports = {
  // Retrieve the game's info
  async show(req, res){
    const { id } = req.params;
    try{
      const game = await Game.findById(id);

      return res.json(game);
    }
    catch(error){
      return res.status(400).json({ error: String(error) });
    }
  },
  // Create a game's initial config
  async store(req, res){
    const { name, description, theme, administrators, levelInfo } = req.body;
    const { filename } = req.file;

    try{
      // Only one game may exist. So, before creating a new one, we make sure there is no other already created.
      const games = await Game.find({});

      if(games.length > 0)
        return res.json(games[0]);

      const game = await Game.create({
        name,
        description,
        theme,
        image: filename,
        administrators,
        levelInfo,
      }).catch(error => {throw error})

      return res.json(game);
    }
    catch(error){
      return res.status(400).json({ error: String(error) });
    }
  }
}
