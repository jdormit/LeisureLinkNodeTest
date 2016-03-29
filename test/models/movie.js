'use strict';

var expect = require('chai').expect;
var movie = require('../../models/movie');

describe('Movie Model', function () {

	describe('Create Movie', function () {

		it('creates a movie successfully', function (done) {

			var name = "The Godfather";
			var description = "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.";
			var release_year = 1972;
			var rating = 9.2;
			var actors = ["Marlon Brando", "Al Pacino", "James Caan"];
			var directors = ["Francic Ford Coppola"];

			movie.create(name, description, release_year, rating, actors, directors, function (err, result) {

				expect(err).to.not.exist;

				expect(result.name).to.equal("The Godfather");
				expect(result.description).to.equal("The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.");
				expect(result.release_year).to.equal(1972);
				expect(result.rating).to.equal(9.2);
				expect(result.actors).to.deep.equal(["Marlon Brando", "Al Pacino", "James Caan"]);
				expect(result.directors).to.deep.equal(["Francic Ford Coppola"]);

				done();
			});
		});

		it('does not create a movie with a duplicate name', function (done) {

			var name = "The Godfather";
			var description = "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.";
			var release_year = 1972;
			var rating = 9.2;
			var actors = ["Marlon Brando", "Al Pacino", "James Caan"];
			var directors = ["Francic Ford Coppola"];

			movie.create(name, description, release_year, rating, actors, directors, function (err, result) {

				expect(err).to.not.exist;

				expect(result).to.equal("MOVIE_ALREADY_EXISTS");

				done()
			});
		});

	});

	describe('Get a movie', function () {

		it('finds a movie by name', function (done) {

			movie.get("The Godfather", function (err, result) {

				expect(err).to.not.exist;

				expect(result.name).to.equal("The Godfather");
				expect(result.description).to.equal("The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.");
				expect(result.release_year).to.equal(1972);
				expect(result.rating).to.equal(9.2);
				expect(result.actors).to.deep.equal(["Marlon Brando", "Al Pacino", "James Caan"]);
				expect(result.directors).to.deep.equal(["Francic Ford Coppola"]);

				done();
			});

		});

		it('does not find a movie that is not in the database', function (done) {

			movie.get("The Departed", function (err, result) {

				expect(err).to.not.exist;

				expect(result).to.equal("EMPTY_RESULT");

				done();
			});

		});

	});

	describe('Update a movie', function () {
			
		it('updates a movie title correctly', function (done) {

		});

		it('does not update a movie title to a duplicate title', function (done) {

		});

		it('updates a movie description correctly', function (done) {

		});

		it('updates a movie release year correctly', function (done) {

		});

		it('does not update a movie release year to an invalid year', function (done) {

		});

		it('updates a movie rating correctly', function (done) {

		});

		it('does not update a movie rating to an invalid rating', function (done) {

		});

		it('updates a movie actors list correctly', function (done) {

		});

		it('updates a directors list correctly', function (done) {

		});

	});

	describe('Delete a movie', function () {

		it('deletes a movie from the database', function(done) {
			
			movie.delete("The Godfather", function (error) {

				expect(error).to.not.exist;

				movie.get("The Godfather", function (err, result) {
					
					expect(err).to.not.exist;

					expect(result).to.equal("EMPTY_RESULT");

					done();
				});

			});

		});

	});
});