// Application initialization and entry point

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var db = require('./db');
var routes = require('./controllers/index');

var app = express();

// setup body parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// setup view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

// pass requests to routers
app.use('/', routes);

// connect to database
db.connect(function (error) {
	if (error) throw error;
});

// expose the http server for testing
module.exports = app.listen(3000, function () {
	console.log("Application started: http://localhost:3000");
});