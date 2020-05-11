const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../../../config');

//TOKEN FORMAT
//Authorization: Bearer <access_token>

module.exports = (req, res, next) => {
    try{
        const bearerHeader = req.headers['authorization'];

        if(!bearerHeader) throw "Invalid token";

        //Splits token on space due to its format
        const bearer = bearerHeader.split(' ');
        //Gets token from the array
        const bearerToken = bearer[1];
        jwt.verify(bearerToken, SECRET_KEY, async (error, authData) => {
            if(error) throw error;
            
            else {
                res.authData = authData;
                
                //Next Middleware
                next();
            }
        });
    }
    catch(error){
        //Access Forbidden
        res.status(403).send({ error: String(error) })
    }
}