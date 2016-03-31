// Unit test index

'use strict';

describe('Test Database and Models', function () {
	
	require('./db');
	require('./models/movie');
	require('./models/actor');
	require('./models/director');
	require('./db_close.js');

});

describe('Test Controllers', function () {

	require('./controllers/index');
	require('./controllers/director');
	require('./controllers/movie');

});