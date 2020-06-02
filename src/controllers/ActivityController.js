const Activity = require('../models/Activity');

// This controller manages the activities in the application, creating and updating their data
module.exports = {
  // This method lists all activities
  async index(req, res){
    try{
      const activities = await Activity.find({}).catch(error => {throw error});

      return res.json(activities);
    }
    catch(error){
      return res.status(400).json({ error: String(error) });
    }
  },
  // The store methods creates a new activity
  async store(req, res){
    const { name, description, experience, dmRules } = req.body;

    try{
      const activity = await Activity.create({
        name,
        description,
        experience,
        dmRules
      }).catch(error => {throw error});

      return res.json(activity);
    }
    catch(error){
      return res.status(400).json({ error: String(error) });
    }
  },
  // This method updates an activity
  async update(req, res){
    const { name, description, experience, dmRules } = req.body;
    const { id } = req.params;

    try{
      const activity = await Activity.findById(id).catch(error => {throw error});

      const changelog = {
        version: activity.changelog[0] ? activity.changelog[0].version + 1 : 1,
        log: new Date(),
        changes: {
          name: activity.name,
          description: activity.description,
          experience: activity.experience,
          dmRules: activity.dmRules,
        },
        userId: res.auth.id,
      }

      let updateDocument = {}
      if(name)
        updateDocument.name = name;
      if(description)
        updateDocument.description = description;
      if(experience)
        updateDocument.experience = experience;
      if(dmRules)
        updateDocument.dmRules = dmRules;

      const updatedActivity = await Activity.updateOne({
        _id: id
      }, {
        $set: updateDocument,
        $push: {
          changelog: {
            $each: [ changelog ],
            $position: 0
          }
        }
      }).catch(error => {throw error});

      return res.json(updatedActivity);
    }
    catch(error){
      return res.status(400).json({ error: String(error) });
    }
  }
};
