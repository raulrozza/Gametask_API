const Achievement = require('../models/Achievement');

// This controller manages the achievements in the application, creating and updating their data
module.exports = {
    // This method removes a achievement
    async delete(req, res){
        const { id } = req.params;

        try{
            const deleted = await Achievement.deleteOne({
                _id: id
            }).catch(error => {throw error});

            return res.json(deleted);
        }
        catch(error){
            return res.status(400).json({ error: String(error) });
        }
    },
    // This method lists all achievements
    async index(req, res){
        try{
            const achievements = await Achievement.find({}).populate('title').catch(error => {throw error});

            return res.json(achievements);
        }
        catch(error){
            return res.status(400).json({ error: String(error) });
        }
    },
    // The store methods creates a new achievement
    async store(req, res){
        const { name, description, title } = req.body;
        const { filename } = req.file;

        try{
            const achievement = await Achievement.create({
                name,
                description,
                title,
                image: filename
            }).catch(error => {throw error});

            return res.json(achievement);
        }
        catch(error){
            return res.status(400).json({ error: String(error) });
        }
    },
    // This method updates a achievement
    async update(req, res){
        const { name, description, title } = req.body;
        const { id } = req.params;

        try{
            let updateDocument = {};
            if(name)
                updateDocument.name = name;
            if(description)
                updateDocument.description = description;
            if(title)
                updateDocument.title = title;
            if(req.file)
                updateDocument.image = req.file.filename;

            const achievement = await Achievement.updateOne({
                _id: id
            }, {
                $set: updateDocument
            }).catch(error => {throw error});

            return res.json(achievement);
        }
        catch(error){
            return res.status(400).json({ error: String(error) });
        }
    }
};