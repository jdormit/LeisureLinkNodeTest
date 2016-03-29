'use strict';

var expect = require('chai').expect;
var movie = require('../../models/movie');

describe('Movie Model', function () {

	describe('Create Movie', function () {

		it('creates a movie successfully', function (done) {

			var title = "The Godfather";
			var description = "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.";
			var release_year = 1972;
			var rating = 9.2;
			var actors = ["Marlon Brando", "Al Pacino", "James Caan"];
			var directors = ["Francic Ford Coppola"];

			movie.create(title, description, release_year, rating, actors, directors, function (error, result) {

				expect(error).to.not.exist;

				movie.get("The Godfather", function (error, result) {

					expect(error).to.not.exist;

					expect(result.title).to.equal("The Godfather");
					expect(result.description).to.equal("The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.");
					expect(result.release_year).to.equal(1972);
					expect(result.rating).to.equal(9.2);
					expect(result.actors).to.deep.equal(["Marlon Brando", "Al Pacino", "James Caan"]);
					expect(result.directors).to.deep.equal(["Francic Ford Coppola"]);

					done();
				});
			});
		});

		it('does not create a movie with a duplicate title', function (done) {

			var title = "The Godfather";
			var description = "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.";
			var release_year = 1972;
			var rating = 9.2;
			var actors = ["Marlon Brando", "Al Pacino", "James Caan"];
			var directors = ["Francic Ford Coppola"];

			movie.create(title, description, release_year, rating, actors, directors, function (error, result) {

				expect(error).to.not.exist;

				expect(result).to.equal("MOVIE_ALREADY_EXISTS");

				done()
			});
		});

	});

	describe('Get a movie', function () {

		it('finds a movie by title', function (done) {

			movie.get("The Godfather", function (error, result) {

				expect(error).to.not.exist;

				expect(result.title).to.equal("The Godfather");
				expect(result.description).to.equal("The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.");
				expect(result.release_year).to.equal(1972);
				expect(result.rating).to.equal(9.2);
				expect(result.actors).to.deep.equal(["Marlon Brando", "Al Pacino", "James Caan"]);
				expect(result.directors).to.deep.equal(["Francic Ford Coppola"]);

				done();
			});

		});

		it('does not find a movie that is not in the database', function (done) {

			movie.get("The Departed", function (error, result) {

				expect(error).to.not.exist;

				expect(result).to.equal("EMPTY_RESULT");

				done();
			});

		});

	});

	describe('Update a movie', function () {
			
		it('updates a movie title correctly', function (done) {
			movie.updateTitle("The Godfather", "The Godfather: Part 2", function (error) {
				
				expect(error).to.not.exist;

				movie.get("The Godfather: Part 2", function (error, result) {

					expect(error).to.not.exist;

					expect(result.title).to.equal("The Godfather: Part 2");
					expect(result.description).to.equal("The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.");
					expect(result.release_year).to.equal(1972);
					expect(result.rating).to.equal(9.2);
					expect(result.actors).to.deep.equal(["Marlon Brando", "Al Pacino", "James Caan"]);
					expect(result.directors).to.deep.equal(["Francic Ford Coppola"]);

					done();
				});

			});
		});

		it('updates a movie description correctly', function (done) {

			var new_description = "The early life and career of Vito Corleone in 1920s New York is portrayed while his son, Michael, expands and tightens his grip on his crime syndicate stretching from Lake Tahoe, Nevada to pre-revolution 1958 Cuba."

			movie.updateDescription("The Godfather: Part 2", new_description, function (error) {

				expect(error).to.not.exist;

				movie.get("The Godfather: Part 2", function (error, result) {

					expect(error).to.not.exist;

					expect(result.title).to.equal("The Godfather: Part 2");
					expect(result.description).to.equal("The early life and career of Vito Corleone in 1920s New York is portrayed while his son, Michael, expands and tightens his grip on his crime syndicate stretching from Lake Tahoe, Nevada to pre-revolution 1958 Cuba.");
					expect(result.release_year).to.equal(1972);
					expect(result.rating).to.equal(9.2);
					expect(result.actors).to.deep.equal(["Marlon Brando", "Al Pacino", "James Caan"]);
					expect(result.directors).to.deep.equal(["Francic Ford Coppola"]);

					done();
				});

			});

		});

		it('updates a movie release year correctly', function (done) {

			movie.updateReleaseYear("The Godfather: Part 2", 1974, function (error) {

				expect(error).to.not.exist;

				movie.get("The Godfather: Part 2", function (error, result) {

					expect(error).to.not.exist;

					expect(result.title).to.equal("The Godfather: Part 2");
					expect(result.description).to.equal("The early life and career of Vito Corleone in 1920s New York is portrayed while his son, Michael, expands and tightens his grip on his crime syndicate stretching from Lake Tahoe, Nevada to pre-revolution 1958 Cuba.");
					expect(result.release_year).to.equal(1974);
					expect(result.rating).to.equal(9.2);
					expect(result.actors).to.deep.equal(["Marlon Brando", "Al Pacino", "James Caan"]);
					expect(result.directors).to.deep.equal(["Francic Ford Coppola"]);

					done();
				});

			});

		});

		it('does not update a movie release year to an invalid year', function (done) {

			movie.updateReleaseYear("The Godfather: Part 2", 1342, function (error) {

				expect(error).to.exist;

				movie.get("The Godfather: Part 2", function (error, result) {

					expect(error).to.not.exist;

					expect(result.title).to.equal("The Godfather: Part 2");
					expect(result.description).to.equal("The early life and career of Vito Corleone in 1920s New York is portrayed while his son, Michael, expands and tightens his grip on his crime syndicate stretching from Lake Tahoe, Nevada to pre-revolution 1958 Cuba.");
					expect(result.release_year).to.equal(1974);
					expect(result.rating).to.equal(9.2);
					expect(result.actors).to.deep.equal(["Marlon Brando", "Al Pacino", "James Caan"]);
					expect(result.directors).to.deep.equal(["Francic Ford Coppola"]);

					done();
				});

			});

		});

		it('updates a movie rating correctly', function (done) {

			movie.updateRating("The Godfather: Part 2", 9.0, function (error) {

				expect(error).to.not.exist;

				movie.get("The Godfather: Part 2", function (error, result) {

					expect(error).to.not.exist;

					expect(result.title).to.equal("The Godfather: Part 2");
					expect(result.description).to.equal("The early life and career of Vito Corleone in 1920s New York is portrayed while his son, Michael, expands and tightens his grip on his crime syndicate stretching from Lake Tahoe, Nevada to pre-revolution 1958 Cuba.");
					expect(result.release_year).to.equal(1974);
					expect(result.rating).to.equal(9.0);
					expect(result.actors).to.deep.equal(["Marlon Brando", "Al Pacino", "James Caan"]);
					expect(result.directors).to.deep.equal(["Francic Ford Coppola"]);

					done();
				});

			});

		});

		it('does not update a movie rating to an invalid rating', function (done) {

			movie.updateRating("The Godfather: Part 2", -1, function (error) {

				expect(error).to.exist;

				movie.get("The Godfather: Part 2", function (error, result) {

					expect(error).to.not.exist;

					expect(result.title).to.equal("The Godfather: Part 2");
					expect(result.description).to.equal("The early life and career of Vito Corleone in 1920s New York is portrayed while his son, Michael, expands and tightens his grip on his crime syndicate stretching from Lake Tahoe, Nevada to pre-revolution 1958 Cuba.");
					expect(result.release_year).to.equal(1974);
					expect(result.rating).to.equal(9.0);
					expect(result.actors).to.deep.equal(["Marlon Brando", "Al Pacino", "James Caan"]);
					expect(result.directors).to.deep.equal(["Francic Ford Coppola"]);

					done();
				});

			});

		});

		it('adds an actor to the actors list correctly', function (done) {

			movie.addActor("The Godfather: Part 2", "Robert De Niro", function (error) {

				expect(error).to.not.exist;

				movie.get("The Godfather: Part 2", function (error, result) {

					expect(error).to.not.exist;


					expect(result.title).to.equal("The Godfather: Part 2");
					expect(result.description).to.equal("The early life and career of Vito Corleone in 1920s New York is portrayed while his son, Michael, expands and tightens his grip on his crime syndicate stretching from Lake Tahoe, Nevada to pre-revolution 1958 Cuba.");
					expect(result.release_year).to.equal(1974);
					expect(result.rating).to.equal(9.0);
					expect(result.actors).to.deep.equal(["Marlon Brando", "Al Pacino", "James Caan", "Robert De Niro"]);
					expect(result.directors).to.deep.equal(["Francic Ford Coppola"]);

					done();
				});

			});

		});

		it('removes an actor from the actors list', function (done) {

			movie.removeActor("The Godfather: Part 2", "James Caan", function (error) {

				expect(error).to.not.exist;

				movie.get("The Godfather: Part 2", function (error, result) {

					expect(error).to.not.exist;


					expect(result.title).to.equal("The Godfather: Part 2");
					expect(result.description).to.equal("The early life and career of Vito Corleone in 1920s New York is portrayed while his son, Michael, expands and tightens his grip on his crime syndicate stretching from Lake Tahoe, Nevada to pre-revolution 1958 Cuba.");
					expect(result.release_year).to.equal(1974);
					expect(result.rating).to.equal(9.0);
					expect(result.actors).to.deep.equal(["Marlon Brando", "Al Pacino", "Robert De Niro"]);
					expect(result.directors).to.deep.equal(["Francic Ford Coppola"]);

					done();
				});

			});

		});

		it('does not remove an actor that is not on the actors list', function (done) {

			movie.removeActor("The Godfather: Part 2", "James Caan", function (error) {

				expect(error).to.exist;

				movie.get("The Godfather: Part 2", function (error, result) {

					expect(error).to.not.exist;

					expect(result.title).to.equal("The Godfather: Part 2");
					expect(result.description).to.equal("The early life and career of Vito Corleone in 1920s New York is portrayed while his son, Michael, expands and tightens his grip on his crime syndicate stretching from Lake Tahoe, Nevada to pre-revolution 1958 Cuba.");
					expect(result.release_year).to.equal(1974);
					expect(result.rating).to.equal(9.0);
					expect(result.actors).to.deep.equal(["Marlon Brando", "Al Pacino", "Robert De Niro"]);
					expect(result.directors).to.deep.equal(["Francic Ford Coppola"]);

					done();
				});

			});

		});

		it('adds a director to the directors list', function (done) {

			movie.addDirector("The Godfather: Part 2", "J.J. Abrams", function (error) {

				expect(error).to.not.exist;

				movie.get("The Godfather: Part 2", function (error, result) {

					expect(error).to.not.exist;

					expect(result.title).to.equal("The Godfather: Part 2");
					expect(result.description).to.equal("The early life and career of Vito Corleone in 1920s New York is portrayed while his son, Michael, expands and tightens his grip on his crime syndicate stretching from Lake Tahoe, Nevada to pre-revolution 1958 Cuba.");
					expect(result.release_year).to.equal(1974);
					expect(result.rating).to.equal(9.0);
					expect(result.actors).to.deep.equal(["Marlon Brando", "Al Pacino", "Robert De Niro"]);
					expect(result.directors).to.deep.equal(["Francic Ford Coppola", "J.J. Abrams"]);

					done();
				});

			});

		});

		it('removes a director from the directors list', function (done) {

			movie.removeDirector("The Godfather: Part 2", "J.J. Abrams", function (error) {

				expect(error).to.not.exist;

				movie.get("The Godfather: Part 2", function (error, result) {

					expect(error).to.not.exist;

					expect(result.title).to.equal("The Godfather: Part 2");
					expect(result.description).to.equal("The early life and career of Vito Corleone in 1920s New York is portrayed while his son, Michael, expands and tightens his grip on his crime syndicate stretching from Lake Tahoe, Nevada to pre-revolution 1958 Cuba.");
					expect(result.release_year).to.equal(1974);
					expect(result.rating).to.equal(9.0);
					expect(result.actors).to.deep.equal(["Marlon Brando", "Al Pacino", "Robert De Niro"]);
					expect(result.directors).to.deep.equal(["Francic Ford Coppola"]);

					done();
				});

			});

		});

		it('does not remove a director that is not on the directors list', function (done) {

			movie.removeDirector("The Godfather: Part 2", "J.J. Abrams", function (error) {

				expect(error).to.exist;

				movie.get("The Godfather: Part 2", function (error, result) {

					expect(error).to.not.exist;

					expect(result.title).to.equal("The Godfather: Part 2");
					expect(result.description).to.equal("The early life and career of Vito Corleone in 1920s New York is portrayed while his son, Michael, expands and tightens his grip on his crime syndicate stretching from Lake Tahoe, Nevada to pre-revolution 1958 Cuba.");
					expect(result.release_year).to.equal(1974);
					expect(result.rating).to.equal(9.0);
					expect(result.actors).to.deep.equal(["Marlon Brando", "Al Pacino", "Robert De Niro"]);
					expect(result.directors).to.deep.equal(["Francic Ford Coppola"]);

					done();
				});

			});

		});

	});

	describe('Delete a movie', function () {

		it('deletes a movie from the database', function(done) {
			
			movie.delete("The Godfather: Part 2", function (error) {

				expect(error).to.not.exist;

				movie.get("The Godfather: Part 2", function (error, result) {
					
					expect(error).to.not.exist;

					expect(result).to.equal("EMPTY_RESULT");

					done();
				});

			});

		});

	});
});