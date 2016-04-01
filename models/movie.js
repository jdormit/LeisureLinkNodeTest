var db = require('../db');
var collection = "movie";

exports.create = function (title, description, release_year, rating, actors, directors, callback) {
	// generate id
	var id = title.toLowerCase().replace(/[\s\-\.\'\:]/g, "");

	// make sure movie is not already in database
	db.find(collection, { title: title }, undefined, function (error, result) {
		if (error) return callback(error);
		if (result !== 'EMPTY_RESULT') return callback(undefined, 'MOVIE_ALREADY_EXISTS');
		// validate arguments
		if (release_year < 1800 || release_year > (new Date().getFullYear())) return callback(new Error("Invalid Release Year"));
		if (rating < 1 || rating > 10) return callback(new Error("Invalid Rating"));

		// construct movie object
		var movie = {
			id: id,
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
	// normalize title
	var id = title.toLowerCase().replace(/[\s\-\.\'\:]/g, "");

	db.find(collection, { id: id }, undefined, function (error, result) {
		callback(error, result);
	});
}

exports.all = function (callback) {
	db.find(collection, undefined, undefined, function (error, result) {
		// ensure that result is an array
		console.log(result);
		if (!Array.isArray(result)) result = [result];
		callback(error, result);
	});
}

// update functions
exports.updateTitle = function (oldTitle, newTitle, callback) {
	// normalize title
	var id = oldTitle.toLowerCase().replace(/[\s\-\.\'\:]/g, "");
	
	// generate new id
	var id_new = newTitle.toLowerCase().replace(/[\s\-\.\'\:]/g, "");

	db.update(collection, { id: id }, { id: id_new, title: newTitle }, function (error, result) { 
		callback(error, id_new); // return the new id in the callback
	});
};

exports.updateDescription = function (title, newDescription, callback) {
	// normalize title
	var id = title.toLowerCase().replace(/[\s\-\.\'\:]/g, "");

	db.update(collection, { id: id }, { description: newDescription }, function (error, result) { 
		callback(error);
	});
};

exports.updateReleaseYear = function (title, newYear, callback) {
	// normalize title
	var id = title.toLowerCase().replace(/[\s\-\.\'\:]/g, "");

	// validate year
	if (newYear < 1800 || newYear > (new Date().getFullYear())) return callback	(new Error("Invalid Release Year"));
	
	db.update(collection, { id: id }, { release_year: newYear }, function (error) { 
		callback(error);
	});
};

exports.updateRating = function (title, newRating, callback) {
	// normalize title
	var id = title.toLowerCase().replace(/[\s\-\.\'\:]/g, "");

	// validate rating
	if (newRating < 1 || newRating > 10) return callback(new Error("Invalid Rating"));
	
	db.update(collection, { id: id }, { rating: newRating }, function (error) { 
		callback(error);
	});
}

exports.addActor = function (title, actor, callback) {
	// normalize title
	var id = title.toLowerCase().replace(/[\s\-\.\'\:]/g, "");

	if (typeof actor !== "string") return callback(new Error("Invalid Actor"));
	
	exports.get(title, function (error, result) {
		if (error) return callback(error);
		var actors = result.actors;
		actors.push(actor);
		db.update(collection, { id: id }, { actors: actors }, function (error, result) { 
			callback(error);
		});
	});
};

exports.removeActor = function (title, actor, callback) {
	// normalize title
	var id = title.toLowerCase().replace(/[\s\-\.\'\:]/g, "");

	if (typeof actor !== "string") return callback(new Error("Invalid Actor"));
	exports.get(title, function (error, result) {
		if (error) return callback(error);
		if (result.actors.indexOf(actor) === -1) return callback(new Error("Actor Does Not Exist"));
		var actors = result.actors;
		actors.splice(actors.indexOf(actor), 1);
		db.update(collection, { id: id }, { actors: actors }, function (error, result) { 
			callback(error);
		});
	});
}

exports.updateActors = function (title, actors, callback) {
	// normalize title
	var id = title.toLowerCase().replace(/[\s\-\.\'\:]/g, "");

	if (!Array.isArray(actors)) return callback(new Error("Actors Must Be An Array"));
	db.update(collection, { id: id }, { actors: actors }, function (error, status) { 
		callback(error);
	});
};

exports.addDirector = function (title, director, callback) {
	// normalize title
	var id = title.toLowerCase().replace(/[\s\-\.\'\:]/g, "");

	if (typeof director !== "string") return callback(new Error("Invalid Director"));
	exports.get(title, function (error, result) {
		if (error) return callback(error);
		var directors = result.directors;
		directors.push(director);
		db.update(collection, { id: id }, { directors: directors }, function (error, result) {
			callback(error);
		});
	});
};

exports.removeDirector = function (title, director, callback) {
	// normalize title
	var id = title.toLowerCase().replace(/[\s\-\.\'\:]/g, "");
	
	if (typeof director !== "string") return callback(new Error("Invalid Director"));
	exports.get(title, function (error, result) {
		if (error) return callback(error);
		if (result.directors.indexOf(director) === -1) return callback(new Error("Director Does Not Exist"));
		var directors = result.directors;
		directors.splice(directors.indexOf(director), 1);
		db.update(collection, { id: id }, { directors: directors }, function (error, result) {
			callback(error);
		});
	});
};

exports.updateDirectors = function (title, directors, callback) {
	// normalize title
	var id = title.toLowerCase().replace(/[\s\-\.\'\:]/g, "");
	
	if (!Array.isArray(directors)) return callback(new Error("Directors Must Be An Array"));
	db.update(collection, { id: id }, { directors: directors }, function (error, status) {
		callback(error);
	});
};

exports.delete = function (title, callback) {
	// normalize title
	var id = title.toLowerCase().replace(/[\s\-\.\'\:]/g, "");

	db.delete(collection, { id: id }, function (error, result) {
		callback(error, result);
	});
};