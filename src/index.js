const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Server's functions
const routes = require('./routes.js');

// Environment variables
const { PORT, MONGO_URL, CORS_CONFIG } = require('../config');

// Initial server configuration
const server = express();

mongoose.connect(MONGO_URL, {
	useUnifiedTopology: true,
	useNewUrlParser: true
})
.catch(error => console.error("MongoDB error:", error));

if(CORS_CONFIG){
	const whitelist = [CORS_CONFIG]
	const corsOptionsDelegate = (req, callback) => {
	let corsOptions;
		if (whitelist.indexOf(req.header('Origin')) !== -1)
			corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
		else
			corsOptions = { origin: false } // disable CORS for this request
		
		callback(null, corsOptions) // callback expects two parameters: error and options
	}
	server.use(cors(corsOptionsDelegate))
}
	
else
	server.use(cors());
	
server.use(express.json());
server.use(routes);

server.listen(PORT, () => console.log(`Server and Updater started on port ${PORT}`));