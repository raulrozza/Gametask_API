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
    }
};