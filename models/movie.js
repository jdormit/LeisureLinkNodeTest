var db = require('../db');
var collection = "movie";

exports.create = function (name, description, release_year, rating, actors, directors, callback) {
	// make sure movie is not already in database
	db.find(collection, { name: name }, undefined, function (err, result) {
		if (err) return callback(err);
		if (result !== 'EMPTY_RESULT') return callback(undefined, 'MOVIE_ALREADY_EXISTS');
		// validate arguments
		if (release_year < 1800 || release_year > (new Date().getFullYear())) return done(new Error("Invalid Release Year"));
		if (rating < 1 || rating > 10) return done(new Error("Invalid Rating"));

		// construct movie object
		var movie = {
			name: name,
			description: description, // the client will handle the case where this is undefined
			release_year: release_year,
			rating: rating,
			actors: actors,
			directors: directors
		}

		// save to database
		db.save(collection, movie, function (err, item, result) {
			callback(err, item);
		});
	});
}

exports.get = function (name, callback) {
	db.find(collection, { name: name }, undefined, function (err, result) {
		callback(err, result);
	});
}

exports.delete = function (name, callback) { 
	db.delete(collection, { name: name }, function (err, result) {
		callback(err, result);
	});
};