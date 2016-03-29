var db = require('../db');
var collection = "movie";

exports.create = function (title, description, release_year, rating, actors, directors, callback) {
	// make sure movie is not already in database
	db.find(collection, { title: title }, undefined, function (error, result) {
		if (error) return callback(error);
		if (result !== 'EMPTY_RESULT') return callback(undefined, 'MOVIE_ALREADY_EXISTS');
		// validate arguments
		if (release_year < 1800 || release_year > (new Date().getFullYear()) || typeof release_year !== "number") return callback(new Error("Invalid Release Year"));
		if (rating < 1 || rating > 10 || typeof rating !== "number") return callback(new Error("Invalid Rating"));

		// construct movie object
		var movie = {
			title: title,
			description: description, // the client will handle the case where this is undefined
			release_year: release_year,
			rating: rating,
			actors: actors,
			directors: directors
		}

		// save to database
		db.save(collection, movie, function (error, result) {
			callback(error);
		});
	});
}

exports.get = function (title, callback) {
	db.find(collection, { title: title }, undefined, function (error, result) {
		callback(error, result);
	});
}

// update functions
exports.updateTitle = function (oldTitle, newTitle, callback) {
	db.update(collection, { title: oldTitle }, { title: newTitle }, function (error, result) { 
		callback(error);
	});
};

exports.updateDescription = function (title, newDescription, callback) {
	db.update(collection, { title: title }, { description: newDescription }, function (error, result) { 
		callback(error);
	});
};

exports.updateReleaseYear = function (title, newYear, callback) {
	// validate year
	if (newYear < 1800 || newYear > (new Date().getFullYear()) || typeof newYear !== "number") return callback	(new Error("Invalid Release Year"));
	db.update(collection, { title: title }, { release_year: newYear }, function (error) { 
		callback(error);
	});
};

exports.updateRating = function (title, newRating, callback) {
	// validate rating
	if (newRating < 1 || newRating > 10 || typeof newRating !== "number") return callback(new Error("Invalid Rating"));
	db.update(collection, { title: title }, { rating: newRating }, function (error) { 
		callback(error);
	});
}

exports.addActor = function (title, actor, callback) {
	if (typeof actor !== "string") return callback(new Error("Invalid Actor"));
	exports.get(title, function (error, result) {
		if (error) return callback(error);
		var actors = result.actors;
		actors.push(actor);
		db.update(collection, { title: title }, { actors: actors }, function (error, result) { 
			callback(error);
		});
	});
};

exports.removeActor = function (title, actor, callback) {
	if (typeof actor !== "string") return callback(new Error("Invalid Actor"));
	exports.get(title, function (error, result) {
		if (error) return callback(error);
		if (result.actors.indexOf(actor) === -1) return callback(new Error("Actor Does Not Exist"));
		var actors = result.actors;
		actors.splice(actors.indexOf(actor), 1);
		db.update(collection, { title: title }, { actors: actors }, function (error, result) { 
			callback(error);
		});
	});
}

exports.addDirector = function (title, director, callback) {
	if (typeof director !== "string") return callback(new Error("Invalid Director"));
	exports.get(title, function (error, result) {
		if (error) return callback(error);
		var directors = result.directors;
		directors.push(director);
		db.update(collection, { title: title }, { directors: directors }, function (error, result) {
			callback(error);
		});
	});
};

exports.removeDirector = function (title, director, callback) {
	if (typeof director !== "string") return callback(new Error("Invalid Director"));
	exports.get(title, function (error, result) {
		if (error) return callback(error);
		if (result.directors.indexOf(director) === -1) return callback(new Error("Director Does Not Exist"));
		var directors = result.directors;
		directors.splice(directors.indexOf(director), 1);
		db.update(collection, { title: title }, { directors: directors }, function (error, result) {
			callback(error);
		});
	});
}

exports.delete = function (title, callback) { 
	db.delete(collection, { title: title }, function (error, result) {
		callback(error, result);
	});
};