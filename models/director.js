var db = require('../db');
var collection = "director";

exports.create = function (name, age, gender, directed, callback) {
	// check for duplicates
	exports.get(name, function (error, result) {
		if (error) return callback(error);
		if (result !== "EMPTY_RESULT") return callback(new Error("Director Already Exists"));

		// validate arguments
		if (age < 0 || age > 125 || typeof age !== "number") return callback(new Error("Invalid Age"));
		if (!(gender === 'M' || gender === 'F')) return callback(new Error("Invalid Gender"));

		var director = {
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
	db.find(collection, { name: name }, undefined, function (error, result) {
		callback(error, result);
	});
};

exports.updateName = function (oldName, newName, callback) {
	db.update(collection, { name: oldName }, { name: newName }, function (error, status) {
		callback(error);
	});
};

exports.updateAge = function (name, newAge, callback) {
	// validate age
	if (newAge < 0 || newAge > 125 || typeof newAge !== "number") return callback(new Error("Invalid Age"));

	db.update(collection, { name: name }, { age: newAge }, function (error, status) {
		callback(error);
	});
};

exports.addFilm = function (name, film, callback) {
	exports.get(name, function (error, result) {
		if (error) return callback(error);
		if (result.directed.indexOf(film) !== -1) return callback(new Error("Film Already Exists"));

		var directed = result.directed;
		directed.push(film);
		db.update(collection, { name: name }, { directed: directed }, function (error, status) {
			callback(error);
		});
	});
};

exports.removeFilm = function (name, film, callback) {
	exports.get(name, function (error, result) {
		if (error) return callback(error);
		if (result.directed.indexOf(film) === -1) return callback(new Error("Film Does Not Exist"));

		var directed = result.directed;
		directed.splice(directed.indexOf(film), 1);
		db.update(collection, { name: name }, { directed: directed }, function (error, status) {
			callback(error);
		});
	});
};

exports.delete = function (name, callback) {
	db.delete(collection, { name: name }, function (error, status) {
		callback(error);
	});
};