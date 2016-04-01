// Actor controller

var express = require('express');
var router = express.Router();

var actor = require('../models/actor');

// GET /actor returns all actors
router.get('/', function (req, res, next) {
	actor.all(function (error, result) {
		if (error) throw error;
		// check for empty result
		if (result === "EMPTY_RESULT")
			res.status(404).send("No actors found");
		else
			res.status(200).send(result);
	});
});

// GET /actor/:id returns one actor
router.get('/:id', function (req, res, next) {
	var id = req.params.id;
	actor.get(id, function (error, result) {
		if (error) throw error;
		// check for empty result
		if (result === "EMPTY_RESULT")
			res.status(404).send("actor not found");
		else
			res.status(200).send(result);
	});
});

// POST /actor adds a actor to the database
router.post('/', function (req, res, next) {
	var name = req.body.name;
	var age = req.body.age;
	var gender = req.body.gender;
	var agent = req.body.agent
	var filmography = req.body.filmography;
	
	// make sure all parameters other than agent are included
	if (!name || !age || !gender || !filmography)
		res.status(400).send("Invalid parameters");
	else {
		actor.create(name, age, gender, agent, filmography, function (error) {
			if (error) throw error;
			res.status(200).send("actor added");
		});
	}
});

// PUT /actor/:id updates a actor
router.put('/:id', function (req, res, next) {
	var id = req.params.id;
	actor.get(id, function (error, result) {
		if (error) throw error;
		if (result === 'EMPTY_RESULT') res.status(404).send("actor not found")
		
		// changing the name will change the id, so handle that first
		if (req.body.name) {
			actor.updateName(id, req.body.name, function (error, new_id) {
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
						actor.updateName(id, req.body[param], function (error) {
							if (error) throw error;
						});
						break;
					case "age":
						actor.updateAge(id, req.body[param], function (error) {
							if (error) throw error;
						});
						break;
					case "agent":
						actor.updateAgent(id, req.body[param], function (error) {
							if (error) throw error;
						});
						break;
					case "filmography":
						actor.updateFilmography(id, req.body[param], function (error) {
							if (error) throw error;
						});
						break;
					default:
						// the parameter is invalid
						res.status(400).send("Invalid parameter");
				}
			}
			res.status(200).send("actor updated");
		}
	});
});

// DELETE /actor/:id deletes a actor
router.delete('/:id', function (req, res, next) {
	var id = req.params.id;
	actor.get(id, function (error, result) {
		if (error) throw error;
		if (result === 'EMPTY_RESULT') res.status(404).send("actor not found");
		actor.delete(id, function (error) {
			if (error) throw error;
			res.status(200).send("actor deleted");
		});
	});
});

module.exports = router;