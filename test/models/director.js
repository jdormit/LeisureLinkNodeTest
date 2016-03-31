'use strict';

var expect = require('chai').expect;
var director = require('../../models/director');

describe('Director Model', function () {

	describe('Create a director', function () {

		it('creates a director', function (done) {
			
			var name = "J.J. Abrams";
			var age = 50;
			var gender = 'M';
			var directed = ["Star Wars: The Force Awakens", "Star Trek Into Darkness"]

			director.create(name, age, gender, directed, function (error) {

				expect(error).to.not.exist;

				done();
			});
		});

		it('does not create a duplicate director', function (done) {

			var name = "J.J. Abrams";
			var age = 50;
			var gender = 'M';
			var directed = ["Star Wars: The Force Awakens", "Star Trek Into Darkness"]

			director.create(name, age, gender, directed, function (error) {

				expect(error).to.exist;

				done();
			});

		});

	});

	describe('Get a director', function () {

		it('gets a director by name', function (done) {

			director.get("J.J. Abrams", function (error, result) {

				expect(error).to.not.exist;
				
				expect(result.id).to.equal("jjabrams");
				expect(result.name).to.equal("J.J. Abrams");
				expect(result.age).to.equal(50);
				expect(result.gender).to.equal('M');
				expect(result.directed).to.deep.equal(["Star Wars: The Force Awakens", "Star Trek Into Darkness"]);

				done();
			});

		});

		it('does not get a director that is not in the database', function (done) {

			director.get("Alfred Hitchcock", function (error, result) {

				expect(error).to.not.exist;

				expect(result).to.equal("EMPTY_RESULT");

				done();
			});

		});

	});

	describe('Update a director', function () {

		it('updates director name', function (done) {

			director.updateName("J.J. Abrams", "Wes Anderson", function (error) {

				expect(error).to.not.exist;

				director.get("Wes Anderson", function (error, result) {

					expect(error).to.not.exist;
					
					expect(result.id).to.equal("wesanderson");
					expect(result.name).to.equal("Wes Anderson");
					expect(result.age).to.equal(50);
					expect(result.gender).to.equal('M');
					expect(result.directed).to.deep.equal(["Star Wars: The Force Awakens", "Star Trek Into Darkness"]);

					done();

				});
			});

		});

		it('updates director age', function (done) {

			director.updateAge("Wes Anderson", 47, function (error) {

				expect(error).to.not.exist;

				director.get("Wes Anderson", function (error, result) {

					expect(error).to.not.exist;
					
					expect(result.id).to.equal("wesanderson");
					expect(result.name).to.equal("Wes Anderson");
					expect(result.age).to.equal(47);
					expect(result.gender).to.equal('M');
					expect(result.directed).to.deep.equal(["Star Wars: The Force Awakens", "Star Trek Into Darkness"]);

					done();
				});

			});

		});

		it('adds a directed movie', function (done) {

			director.addFilm("Wes Anderson", "Moonrise Kingdom", function (error) {

				expect(error).to.not.exist;

				director.get("Wes Anderson", function (error, result) {

					expect(error).to.not.exist;
					
					expect(result.id).to.equal("wesanderson");
					expect(result.name).to.equal("Wes Anderson");
					expect(result.age).to.equal(47);
					expect(result.gender).to.equal('M');
					expect(result.directed).to.deep.equal(["Star Wars: The Force Awakens", "Star Trek Into Darkness", "Moonrise Kingdom"]);

					done();

				});

			});

		});

		it('removes a directed movie', function (done) {

			director.removeFilm("Wes Anderson", "Star Trek Into Darkness", function (error) {

				expect(error).to.not.exist;

				director.get("Wes Anderson", function (error, result) {

					expect(error).to.not.exist;
					
					expect(result.id).to.equal("wesanderson");
					expect(result.name).to.equal("Wes Anderson");
					expect(result.age).to.equal(47);
					expect(result.gender).to.equal('M');
					expect(result.directed).to.deep.equal(["Star Wars: The Force Awakens", "Moonrise Kingdom"]);

					done();

				});

			});

		});

		it('updates directed movie list', function (done) {
			
			var directed = ["The Grand Budapest Hotel", "The Royal Tenenbaums"];

			director.updateDirected("Wes Anderson", directed, function (error) {
				
				expect(error).to.not.exist;

				director.get("Wes Anderson", function (error, result) {
					
					expect(error).to.not.exist;
					
					expect(result.id).to.equal("wesanderson");
					expect(result.name).to.equal("Wes Anderson");
					expect(result.age).to.equal(47);
					expect(result.gender).to.equal('M');
					expect(result.directed).to.deep.equal(["The Grand Budapest Hotel", "The Royal Tenenbaums"]);
					
					done();
				});

			});
		});

	});

	describe('Delete a director', function () {

		it('deletes a director from the database', function (done) {

			director.delete("Wes Anderson", function (error) {

				expect(error).to.not.exist;

				director.get("Wes Anderson", function (error, result) {

					expect(error).to.not.exist;

					expect(result).to.equal("EMPTY_RESULT");

					done();
				});

			});

		});

	});

});