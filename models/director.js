var db = require('../db');
var collection = "director";

exports.create = function (name, age, gender, directed, callback) {
	// construct id, e.g. "J.J. Abrams" -> "jjabrams"
	var id = name.toLowerCase().replace(/[\s\-\.\'\:]/g, "");
	
	// check for duplicates
	exports.get(name, function (error, result) {
		if (error) return callback(error);
		if (result !== "EMPTY_RESULT") return callback(new Error("Director Already Exists"));

		// validate arguments
		if (age < 0 || age > 125 || typeof age !== "number") return callback(new Error("Invalid Age"));
		if (!(gender === 'M' || gender === 'F')) return callback(new Error("Invalid Gender"));

		var director = {
			id: id,
			name: name,
			age: age,
			gender: gender,
			directed: directed
		};

		db.save(collection, director, function (error, status) {
			callback(error);
		});
	});
};

exports.get = function (name, callback) {
	// normalize id
	var id = name.toLowerCase().replace(/[\s\-\.\'\:]/g, "");

	db.find(collection, { id: id }, undefined, function (error, result) {
		callback(error, result);
	});
};

exports.all = function (callback) {
	db.find(collection, undefined, undefined, function (error, result) { 
		callback(error, result);
	});
};

exports.updateName = function (id, newName, callback) {
	// normalize id
	var id_str = id.toLowerCase().replace(/[\s\-\.\'\:]/g, "");
	
	// generate new id
	var new_id = newName.toLowerCase().replace(/[\s\-\.\'\:]/g, "");

	db.update(collection, { id: id_str }, { id: new_id, name: newName }, function (error, status) {
		callback(error, new_id); // return the new id in the callback
	});
};

exports.updateAge = function (id, newAge, callback) {
	// normalize id
	var id_str = id.toLowerCase().replace(/[\s\-\.\'\:]/g, "");

	// validate age
	if (newAge < 0 || newAge > 125 || typeof newAge !== "number") return callback(new Error("Invalid Age"));

	db.update(collection, { id: id_str }, { age: newAge }, function (error, status) {
		callback(error);
	});
};

exports.updateDirected = function (id, directed, callback) {
	// normalize id
	var id_str = id.toLowerCase().replace(/[\s\-\.\'\:]/g, "");

	// validate directed
	if (!Array.isArray(directed)) return callback(new Error("Directed Must Be Array"));

	db.update(collection, { id: id_str }, { directed: directed }, function (error, status) { 
		callback(error);
	});
};

exports.addFilm = function (id, film, callback) {
	// normalize id
	var id_str = id.toLowerCase().replace(/[\s\-\.\'\:]/g, "");

	exports.get(id_str, function (error, result) {
		if (error) return callback(error);
		if (result.directed.indexOf(film) !== -1) return callback(new Error("Film Already Exists"));

		var directed = result.directed;
		directed.push(film);
		db.update(collection, { id: id_str }, { directed: directed }, function (error, status) {
			callback(error);
		});
	});
};

exports.removeFilm = function (id, film, callback) {
	// normalize id
	var id_str = id.toLowerCase().replace(/[\s\-\.\'\:]/g, "");

	exports.get(id_str, function (error, result) {
		if (error) return callback(error);
		if (result.directed.indexOf(film) === -1) return callback(new Error("Film Does Not Exist"));

		var directed = result.directed;
		directed.splice(directed.indexOf(film), 1);
		db.update(collection, { id: id_str }, { directed: directed }, function (error, status) {
			callback(error);
		});
	});
};

exports.delete = function (id, callback) {
	// normalize id
	var id_str = id.toLowerCase().replace(/[\s\-\.\'\:]/g, "");

	db.delete(collection, { id: id_str }, function (error, status) {
		callback(error);
	});
};