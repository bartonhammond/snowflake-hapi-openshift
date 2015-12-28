// hapi server and configuration
var HapiServer = require('./src/config/hapi');

// connect mongoose
require('./src/database/connect');

// start the server
HapiServer.start(function () {
	console.log('Server is running: ' + HapiServer.info.uri);
});

