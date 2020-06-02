const Rank = require('../models/Rank');

// This controller manages the ranks in the application, creating and updating their data
module.exports = {
  // This method removes a rank
  async delete(req, res){
    const { id } = req.params;

    try{
      const deleted = await Rank.deleteOne({
        _id: id
      }).catch(error => {throw error});

      return res.json(deleted);
    }
    catch(error){
      return res.status(400).json({ error: String(error) });
    }
  },
  // This method lists all ranks
  async index(req, res){
    try{
      const ranks = await Rank.find({}).catch(error => {throw error});

      return res.json(ranks);
    }
    catch(error){
      return res.status(400).json({ error: String(error) });
    }
  },
  // The store methods creates a new rank
  async store(req, res){
    const { name, tag, level } = req.body;

    try{
      const rank = await Rank.create({
        name,
        tag,
        level
      }).catch(error => {throw error});

      return res.json(rank);
    }
    catch(error){
        return res.status(400).json({ error: String(error) });
    }
  },
  // This method updates a rank
  async update(req, res){
    const { name, tag, level } = req.body;
    const { id } = req.params;

    try{
      let updateDocument = {};
      if(name)
        updateDocument.name = name;
      if(tag)
        updateDocument.tag = tag;
      if(level)
        updateDocument.level = level;

      const rank = await Rank.updateOne({
        _id: id
      }, {
        $set: updateDocument
      }).catch(error => {throw error});

      return res.json(rank);
    }
    catch(error){
      return res.status(400).json({ error: String(error) });
    }
  }
};
