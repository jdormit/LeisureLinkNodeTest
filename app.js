//file for application initialization

var express = require('express');
var path = require('path');
var assert = require('assert');

var db = require('./db');
var routes = require('./controllers/index');

var app = express();

//setup view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//serve static files
app.use(express.static(path.join(__dirname, 'public')));

//pass requests to routers
app.use('/', routes);

//connect to database
db.connect(function (error) {
	assert.equal(error, null);
});

app.listen(3000, function () {
	console.log("Application started: http://localhost:3000");
});