// Unit test index

'use strict';

var exec = require('child_process').exec;

describe('Test Database and Models', function () {
	
	require('./db');
	require('./models/movie');
	require('./models/actor');
	require('./models/director');
	require('./db_close.js');

});

describe('Test Controllers', function () {
	
	// start server
	var app = exec('node app.js');

	require('./controllers/index');
	require('./controllers/director');
	require('./controllers/movie');
	require('./controllers/actor');

	// kill server
	app.kill();

});