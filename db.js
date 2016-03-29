var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var URL = 'mongodb://localhost:27017/leisurelinknodetest';

// this stores a reference to the database
var db = null;

// function to connect to the db - it is called on app initialization
exports.connect = function (callback) {
	if (db) return callback(); // if the connection is already open return

	MongoClient.connect(URL, function (err, database) {
		if (err) return callback(err);
		db = database;
		callback();
	});
}

// function to put something into the database
exports.save = function (collection, item, callback) {
	db.collection(collection).insertOne(item, function (err, result) {
		callback(err, item, result); // result is an optional return value
	});
}

//function to update all database object defined by 'criteria'
exports.update = function (collection, criteria, update_fields, callback) {
	var update = {
		$set: update_fields // ensure that the document is not overwritten
	};
	var options = {
		multi: true
	};
	db.collection(collection).update(criteria, update, options, function (err, status) {
		if (err) return callback (err);
		callback(err, status.result); // count is the last field to make it an optional parameter
	});
};

// Function to find database objects
// If a query or projection is not needed, they must be declared as 'undefined' in the function call
exports.find = function (collection, query, projection, callback) {
	db.collection(collection).find(query, projection, function (err, docs) {
		if (err) return callback(err, undefined); // callback in the format callback(err, docs)
		docs.count(function (countErr, count) {
			if (countErr) return callback(countErr, undefined);
			if (count <= 0) {
				callback(undefined, 'EMPTY_RESULT');
			}
			else if (count == 1) { // handle case where there is only one result
				docs.nextObject(function (err, doc) {
					callback(err, doc);
				});
			}
			else { // there are multiple results -- return object organized by {doc._id: doc}
				var result = {};
				docs.each(function (error, doc) {
					if (error) return callback(error, undefined);
					if (doc == null) { //we've reached the end of the cursor
						callback(undefined, result);
					}
					else
						result[doc._id] = doc;
				});
			}
		});
	});
}

// function to find database objects by id
exports.findById = function (collection, id, projection, callback) {
	var o_id = new ObjectID(id);
	exports.find(collection, { _id: o_id }, projection, function (err, docs) {
		callback(err, docs);
	});
}

// function to delete an object in the database
exports.delete = function (collection, selector, callback) {
	db.collection(collection).deleteMany(selector, function (err, result) {
		callback(err, result);
	});
}

// function to close the database connection
exports.close = function (callback) {
	if (db) {
		db.close(function (err, result) {
			db = null;
			callback(err); // this will be callback(null) if there was no error
		});
	}
}

// function to get the database object
exports.get = function () {
	return db;
}