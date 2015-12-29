// hapi server and configuration
var HapiServer = require('./src/config/hapi');

// connect mongodb
require('./src/database/mongodb');

// start the server
HapiServer.start(function () {
	console.log('Server is running: ' + HapiServer.info.uri);
});

