// Director controller

var express = require('express');
var router = express.Router();

var director = require('../models/director');

// GET /director returns all directors
router.get('/', function (req, res, next) {
	director.all(function (error, result) {
		if (error) throw error;
		// check for empty result
		if (result === "EMPTY_RESULT")
			res.status(404).send("No directors found");
		else
			res.status(200).send(result);
	});
});

// GET /director/:id returns one director
router.get('/:id', function (req, res, next) {
	var id = req.params.id;
	director.get(id, function (error, result) {
		if (error) throw error;
		// check for empty result
		if (result === "EMPTY_RESULT")
			res.status(404).send("Director not found");
		else
			res.status(200).send(result);
	});
});

// POST /director adds a director to the database
router.post('/', function (req, res, next) {
	var name = req.body.name;
	var age = req.body.age;
	var gender = req.body.gender;
	var directed = req.body.directed;

	// make sure all parameters other than directed are included
	if (!name || !age || !gender)
		res.status(400).send("Invalid parameters");
	else {
		director.create(name, age, gender, directed, function (error) {
			if (error) throw error;
			res.status(200).send("Director added");
		});
	}
});

// PUT /director/:id updates a director
router.put('/:id', function (req, res, next) {
	var id = req.params.id;
	
	director.get(id, function (error, result) {
		if (error) throw error;
		if (result === 'EMPTY_RESULT') res.status(404).send("Director not found")
		
		// changing the name will change the id, so handle that first
		if (req.body.name) {
			director.updateName(id, req.body.name, function (error, new_id) {
				if (error) throw error;
				id = new_id;
				delete req.body.name; // do not update name twice
				performUpdate();
			});
		}
		else {
			performUpdate();
		}
		// function to perform the update
		function performUpdate() {
			for (param in req.body) {
				switch (param) {
					case "name":
						director.updateName(id, req.body[param], function (error) {
							if (error) throw error;
						});
						break;
					case "age":
						director.updateAge(id, req.body[param], function (error) {
							if (error) throw error;
						});
						break;
					case "directed":
						director.updateDirected(id, req.body[param], function (error) {
							if (error) throw error;
						});
						break;
					default:
						// the parameter is invalid
						res.status(400).send("Invalid parameter");
				}
			}
			res.status(200).send("Director updated");
		}
	});
});

// DELETE /director/:id deletes a director
router.delete('/:id', function (req, res, next) {
	var id = req.params.id;
	director.get(id, function (error, result) {
		if (error) throw error;
		if (result === 'EMPTY_RESULT') res.status(404).send("Director not found");
		director.delete(id, function (error) {
			if (error) throw error;
			res.status(200).send("Director deleted");
		});
	});
});

module.exports = router;