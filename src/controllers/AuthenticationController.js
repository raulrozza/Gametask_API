const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {SECRET_KEY} = require('../../config');

const VALID_DAYS = 7;

/*
    The Authentication Controller is responsible for the authentication methods. It's operations consists in returning the user trying to
    login, and also creating a login session in assossiation with an user
*/
module.exports = {
    // Create a user's session
    async store(req, res ){
        const { email, password } = req.body;

        try{
            let user = await User.findOne({ email }).catch(error => {throw error});
            if (!user)
                return res.status(400).json({ errorCode: 2, error: "User not found!" });
            else{
                //bcrypt compares hashed password with inserted password
                const passwordMatch = await bcrypt.compare(password, user.password).catch(error => {throw error});
                if (passwordMatch) {
                    // Token expires in {VALID_DAYS} days. ExpiresIn takes on a number of seconds, so 60*60*24*VALID_DAYS
                    const token = jwt.sign({ id: user._id, access: user.access }, SECRET_KEY, { expiresIn: VALID_DAYS*86400 });
                    if (!token)
                        return res.status(400).json({ errorCode: 1, error: "Could not create token." });
                    
                    await User.updateOne({
                        _id: user._id
                    },{
                        $set: { token },
                    }).catch(error => {throw error});

                    user.token = token;

                    return res.json(user);
                }
                else
                    return res.status(400).json({ errorCode: 3, error: "Incorrect password" });
            }
        }
        catch(error){
            return res.status(400).json({ errorCode: -1, error: String(error) });
        }
    }
}