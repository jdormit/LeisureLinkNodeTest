'use strict';

var expect = require('chai').expect;
var actor = require('../../models/actor');

describe('Actor Model', function () {
	
	describe('Create an actor', function () {

		it('creates a new actor', function (done) {

			var name = "Al Pacino";
			var age = 76;
			var gender = 'M';
			var agent = "ICM Partners";
			var filmography = ["The Godfather", "The Godfather: Part 2", "Scarface"];

			actor.create(name, age, gender, agent, filmography, function (error) {

				expect(error).to.not.exist;

				done();
			});

		});

		it('does not create an actor with a duplicate name', function (done) {

			var name = "Al Pacino";
			var age = 76;
			var gender = 'M';
			var agent = "ICM Partners";
			var filmography = ["The Godfather", "The Godfather: Part 2", "Scarface"];

			actor.create(name, age, gender, agent, filmography, function (error) {

				expect(error).to.exist;

				done();
			});

		});

	});

	describe('Get an actor', function () {

		it('get an actor by name', function (done) {

			actor.get("Al Pacino", function (error, result) {

				expect(error).to.not.exist;

				expect(result.name).to.equal("Al Pacino");
				expect(result.age).to.equal(76);
				expect(result.gender).to.equal('M');
				expect(result.agent).to.equal("ICM Partners");
				expect(result.filmography).to.deep.equal(["The Godfather", "The Godfather: Part 2", "Scarface"]);

				done();
			});

		});

		it('does not find an actor that is not in the database', function (done) {

			actor.get("Harrison Ford", function (error, result) {

				expect(error).to.not.exist;

				expect(result).to.equal("EMPTY_RESULT");

				done();
			});

		});

	});

	describe('Update an actor', function () {

		it('updates actor name', function (done) {

			actor.updateName("Al Pacino", "Harrison Ford", function (error) {

				expect(error).to.not.exist;

				actor.get("Harrison Ford", function (error, result) {

					expect(error).to.not.exist;

					expect(result.name).to.equal("Harrison Ford");
					expect(result.age).to.equal(76);
					expect(result.gender).to.equal('M');
					expect(result.agent).to.equal("ICM Partners");
					expect(result.filmography).to.deep.equal(["The Godfather", "The Godfather: Part 2", "Scarface"]);

					done();
				});

			});

		});

		it('updates actor age', function (done) {
			
			actor.updateAge("Harrison Ford", 73, function (error) {

				expect(error).to.not.exist;

				actor.get("Harrison Ford", function (error, result) {

					expect(error).to.not.exist;

					expect(result.name).to.equal("Harrison Ford");
					expect(result.age).to.equal(73);
					expect(result.gender).to.equal('M');
					expect(result.agent).to.equal("ICM Partners");
					expect(result.filmography).to.deep.equal(["The Godfather", "The Godfather: Part 2", "Scarface"]);

					done();
				});

			});

		});

		it('updates actor agent', function (done) {

			actor.updateAgent("Harrison Ford", "Patricia McQueeney", function (error) {

				expect(error).to.not.exist;

				actor.get("Harrison Ford", function (error, result) {

					expect(error).to.not.exist;

					expect(result.name).to.equal("Harrison Ford");
					expect(result.age).to.equal(73);
					expect(result.gender).to.equal('M');
					expect(result.agent).to.equal("Patricia McQueeney");
					expect(result.filmography).to.deep.equal(["The Godfather", "The Godfather: Part 2", "Scarface"]);

					done();
				});

			});

		});

		it('adds a movie to the actor filmography', function (done) {

			actor.addFilm("Harrison Ford", "Star Wars: A New Hope", function (error) {

				actor.get("Harrison Ford", function (error, result) {

					expect(error).to.not.exist;

					expect(result.name).to.equal("Harrison Ford");
					expect(result.age).to.equal(73);
					expect(result.gender).to.equal('M');
					expect(result.agent).to.equal("Patricia McQueeney");
					expect(result.filmography).to.deep.equal(["The Godfather", "The Godfather: Part 2", "Scarface", "Star Wars: A New Hope"]);

					done();
				});

			});

		});

		it('removes a movie from the actor filmography', function (done) {

			actor.removeFilm("Harrison Ford", "The Godfather", function (error) {

				expect(error).to.not.exist;

				actor.get("Harrison Ford", function (error, result) {

					expect(error).to.not.exist;

					expect(result.name).to.equal("Harrison Ford");
					expect(result.age).to.equal(73);
					expect(result.gender).to.equal('M');
					expect(result.agent).to.equal("Patricia McQueeney");
					expect(result.filmography).to.deep.equal(["The Godfather: Part 2", "Scarface", "Star Wars: A New Hope"]);

					done();
				});

			});

		});

	});

	describe('Delete an actor', function () {

		it('removes an actor from the database', function (done) {

			actor.delete("Harrison Ford", function (error) {

				expect(error).to.not.exist;

				actor.get("Harrison Ford", function (error, result) {

					expect(error).to.not.exist;

					expect(result).to.equal("EMPTY_RESULT");

					done();
				});

			});

		});

	});

});