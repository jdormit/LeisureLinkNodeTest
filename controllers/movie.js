// Movie controller

var express = require('express');
var router = express.Router();

var movie = require('../models/movie');

// GET /movies returns all movies
router.get('/', function (req, res, next) {
	movie.all(function (error, result) {
		if (error) throw error;
		// check for empty result
		if (result === "EMPTY_RESULT")
			res.status(404).send("No movies found");
		else
			res.status(200).send(result);
	});
});

// GET /movie/:id returns one movie
router.get('/:id', function (req, res, next) {
	var id = req.params.id;
	movie.get(id, function (error, result) {
		if (error) throw error;
		// check for empty result
		if (result === "EMPTY_RESULT")
			res.status(404).send("movie not found");
		else
			res.status(200).send(result);
	});
});

// POST /movie adds a movie to the database
router.post('/', function (req, res, next) {
	var title = req.body.title;
	var description = req.body.description;
	var release_year = req.body.release_year;
	var rating = req.body.rating;
	var actors = req.body.actors;
	var directors = req.body.directors;
	
	// make sure all parameters other than description are included
	if (!title || !release_year || !rating || !actors || !directors)
		res.status(400).send("Invalid parameters");
	else {
		movie.create(title, description, release_year, rating, actors, directors, function (error) {
			if (error) throw error;
			res.status(200).send("movie added");
		});
	}
});

// PUT /movie/:id updates a movie
router.put('/:id', function (req, res, next) {
	var id = req.params.id;
	
	movie.get(id, function (error, result) {
		if (error) throw error;
		if (result === 'EMPTY_RESULT') res.status(404).send("movie not found")
		
		// changing the title will change the id, so handle that first
		if (req.body.title) {
			movie.updateTitle(id, req.body.title, function (error, new_id) {
				if (error) throw error;
				id = new_id;
				delete req.body.title; // do not update name twice
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
					case "title":
						movie.updateTitle(id, req.body[param], function (error) {
							if (error) throw error;
						});
						break;
					case "description":
						movie.updateDescription(id, req.body[param], function (error) {
							if (error) throw error;
						});
						break;
					case "year_released":
						movie.updateReleaseYear(id, req.body[param], function (error) {
							if (error) throw error;
						});
						break;
					case "rating":
						movie.updateRating(id, req.body[param], function (error) {
							if (error) throw error;
						});
						break;
					case "actors":
						console.log(req.body[param]);
						movie.updateActors(id, req.body[param], function (error) {
							if (error) throw error;
						});
						break;
					case "directors":
						movie.updateDirectors(id, req.body[param], function (error) {
							if (error) throw error;
						});
						break;
					default:
						// the parameter is invalid
						res.status(400).send("Invalid parameter");
				}
			}
			res.status(200).send("movie updated");
		}
	});
});

// DELETE /movie/:id deletes a movie
router.delete('/:id', function (req, res, next) {
	var id = req.params.id;
	movie.get(id, function (error, result) {
		if (error) throw error;
		if (result === 'EMPTY_RESULT') res.status(404).send("movie not found");
		movie.delete(id, function (error) {
			if (error) throw error;
			res.status(200).send("movie deleted");
		});
	});
});

module.exports = router;