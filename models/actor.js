var db = require('../db');
var collection = "actor";

exports.create = function (name, age, gender, agent, filmography, callback) {
	// construct id, e.g. "J.J. Abrams" -> "jjabrams"
	var id = name.toLowerCase().replace(/[\s\-\.\'\:]/g, "");

	// check for duplicate entry
	exports.get(id, function (error, result) {
		if (error) return callback(error);
		if (result !== "EMPTY_RESULT") return callback(new Error("Actor Already Exists"));

		// validate arguments
		if (age < -1 || age > 125 || typeof age !== "number") return callback(new Error("Invalid Age"));
		if (!(gender === 'M' || gender === 'F')) return callback(new Error("Invalid Gender"));
		
		var actor = {
			id: id,
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

exports.get = function (id, callback) {
	// id can be a name or an id, so standardize it to an id
	var id_std = id.toLowerCase().replace(/[\s\-\.\'\:]/g, "");

	db.find(collection, { id: id_std }, undefined, function (error, result) { 
		callback(error, result);
	});
};

exports.delete = function (id, callback) {
	// id can be a name or an id, so standardize it to an id
	var id_std = id.toLowerCase().replace(/[\s\-\.\'\:]/g, "");

	db.delete(collection, { id: id_std }, function (error, result) { 
		callback(error);
	});
}

exports.updateName = function (id, newName, callback) {
	// id can be a name or an id, so standardize it to an id
	var id_std = id.toLowerCase().replace(/[\s\-\.\'\:]/g, "");

	// construct new id
	var newId = newName.toLowerCase().replace(/[\s\-\.\'\:]/g, "");

	db.update(collection, { id: id_std }, { id: newId, name: newName }, function (error, status) { 
		callback(error);
	});
};

exports.updateAge = function (id, newAge, callback) {
	// id can be a name or an id, so standardize it to an id
	var id_std = id.toLowerCase().replace(/[\s\-\.\'\:]/g, "");

	// validate age
	if (newAge < -1 || newAge > 125 || typeof newAge !== "number") return callback(new Error("Invalid Age"));

	db.update(collection, { id: id_std }, { age: newAge }, function (error, status) { 
		callback(error);
	});
};

exports.updateAgent = function (id, newAgent, callback) {
	// id can be a name or an id, so standardize it to an id
	var id_std = id.toLowerCase().replace(/[\s\-\.\'\:]/g, "");

	db.update(collection, { id: id_std }, { agent: newAgent }, function (error, status) { 
		callback(error);
	});
};

exports.addFilm = function (id, film, callback) {
	// id can be a name or an id, so standardize it to an id
	var id_std = id.toLowerCase().replace(/[\s\-\.\'\:]/g, "");

	exports.get(id_std, function (error, result) {
		if (error) return callback(error);
		if (result.filmography.indexOf(film) !== -1) return callback(new Error("Film Already Exists"));
		var filmography = result.filmography;
		filmography.push(film);
		db.update(collection, { id: id_std }, { filmography: filmography }, function (error, status) { 
			callback(error);
		});
	});
}

exports.removeFilm = function (id, film, callback) {
	// id can be a name or an id, so standardize it to an id
	var id_std = id.toLowerCase().replace(/[\s\-\.\'\:]/g, "");

	exports.get(id_std, function (error, result) {
		if (error) return callback(error);
		if (result.filmography.indexOf(film) === -1) return callback(new Error("Film Does Not Exist"));
		var filmography = result.filmography;
		filmography.splice(filmography.indexOf(film), 1);
		db.update(collection, { id: id_std }, { filmography: filmography }, function (error, status) { 
			callback(error);
		});
	});
};