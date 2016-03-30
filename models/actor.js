var db = require('../db');
var collection = "actor";

exports.create = function (name, age, gender, agent, filmography, callback) {
	// check for duplicate entry
	exports.get(name, function (error, result) {
		if (error) return callback(error);
		if (result !== "EMPTY_RESULT") return callback(new Error("Actor Already Exists"));

		// validate arguments
		if (age < -1 || age > 125 || typeof age !== "number") return callback(new Error("Invalid Age"));
		if (!(gender === 'M' || gender === 'F')) return callback(new Error("Invalid Gender"));
		
		var actor = {
			name: name,
			age: age,
			gender: gender,
			agent: agent,
			filmography: filmography
		};
		
		db.save(collection, actor, function (error, status) {
			callback(error);
		});
	});
};

exports.get = function (name, callback) {
	db.find(collection, { name: name }, undefined, function (error, result) { 
		callback(error, result);
	});
};

exports.delete = function (name, callback) {
	db.delete(collection, { name: name }, function (error, result) { 
		callback(error);
	});
}

exports.updateName = function (oldName, newName, callback) {
	db.update(collection, { name: oldName }, { name: newName }, function (error, status) { 
		callback(error);
	});
};

exports.updateAge = function (name, newAge, callback) {
	// validate age
	if (newAge < -1 || newAge > 125 || typeof newAge !== "number") return callback(new Error("Invalid Age"));

	db.update(collection, { name: name }, { age: newAge }, function (error, status) { 
		callback(error);
	});
};

exports.updateAgent = function (name, newAgent, callback) {
	db.update(collection, { name: name }, { agent: newAgent }, function (error, status) { 
		callback(error);
	});
};

exports.addFilm = function (name, film, callback) {
	exports.get(name, function (error, result) {
		if (error) return callback(error);
		if (result.filmography.indexOf(film) !== -1) return callback(new Error("Film Already Exists"));
		var filmography = result.filmography;
		filmography.push(film);
		db.update(collection, { name: name }, { filmography: filmography }, function (error, status) { 
			callback(error);
		});
	});
}

exports.removeFilm = function (name, film, callback) {
	exports.get(name, function (error, result) {
		if (error) return callback(error);
		if (result.filmography.indexOf(film) === -1) return callback(new Error("Film Does Not Exist"));
		var filmography = result.filmography;
		filmography.splice(filmography.indexOf(film), 1);
		db.update(collection, { name: name }, { filmography: filmography }, function (error, status) { 
			callback(error);
		});
	});
};