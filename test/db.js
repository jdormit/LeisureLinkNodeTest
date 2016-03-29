"use strict"

var expect = require('chai').expect;
var db = require('../db');

var collection = "tests";

describe('Database', function () {

	it('connects to the database', function (done) {
		db.connect(function (error) {

			expect(error).to.not.exist;

			expect(db.get()).to.exist;

			done()
		});
	});
	
	describe('Save to database', function () {

		it('saves an object to the database', function (done) {
			var data = {
				number: 4,
				string: "foo",
				boolean: true,
				array: [1, 2, 3, 4],
				object: {one: 1, two: 2}
			}

			db.save(collection, data, function (err, result) {

				expect(err).to.be.null;

				expect(result._id).to.exist;

				expect(result.number).to.equal(4);
				expect(result.string).to.equal("foo");
				expect(result.boolean).to.be.true;
				expect(result.array).to.deep.equal([1, 2, 3, 4]);
				expect(result.object).to.deep.equal({one: 1, two: 2});

				done();
			});

		});

	});

	describe('Find database object', function () {

		it('finds an object in the database', function (done) {
		
			db.find(collection, { number: 4 }, undefined, function (err, result) {

				expect(err).to.not.exist;
				expect(result).to.not.equal("EMPTY_RESULT");

				expect(result.number).to.equal(4);
				expect(result.string).to.equal("foo");
				expect(result.boolean).to.be.true;
				expect(result.array).to.deep.equal([1, 2, 3, 4]);
				expect(result.object).to.deep.equal({one: 1, two: 2});

				done();
			});

		});

		it('finds an object with a projection', function (done) {

			db.find(collection, { number: 4 }, { string: 1, boolean: 1 }, function (err, result) {

				expect(err).to.not.exist;

				expect(result.string).to.equal("foo");
				expect(result.number).to.not.exist;
				expect(result.boolean).to.be.true;
				expect(result.array).to.not.exist;
				expect(result.object).to.not.exist;

				done();
			});

		});

		it('does not find an object that is not in the database', function (done) {

			db.find(collection, { string: "baz" }, undefined, function (err, result) {
					
				expect(err).to.not.exist;

				expect(result).to.equal('EMPTY_RESULT');

				done();
			});

		});

	});

	describe('Update an object in the database', function () {

		it('updates a single field', function (done) {
			
			db.update(collection, { string: "foo" }, { number: 6 }, function (err, result) {

				expect(err).to.not.exist;

				expect(result.ok).to.equal(1);
				expect(result.nModified).to.equal(1);

				db.find(collection, { number: 6 }, undefined, function (err, result) {

					expect(err).to.not.exist;

					expect(result.number).to.equal(6);
					expect(result.string).to.equal("foo");
					expect(result.boolean).to.be.true;
					expect(result.array).to.deep.equal([1, 2, 3, 4]);
					expect(result.object).to.deep.equal({one: 1, two: 2});

					done();
				});

			});

		});

		it('updates embedded object values', function (done) {

			db.update(collection, {string: "foo"}, {"object.two": -1}, function(err, result) {
			
				expect(err).to.not.exist;

				expect(result.ok).to.equal(1);
				expect(result.nModified).to.equal(1);

				db.find(collection, { string: "foo" }, undefined, function (err, result) {

					expect(err).to.not.exist;

					expect(result.number).to.equal(6);
					expect(result.string).to.equal("foo");
					expect(result.boolean).to.be.true;
					expect(result.array).to.deep.equal([1, 2, 3, 4]);
					expect(result.object).to.deep.equal({ one: 1, two: -1 });

					done();
				});

			});

		});

	});

	describe('Delete an object in the database', function () {
		
		it('deletes an object', function (done) {

			db.delete(collection, { string: "foo" }, function (err) {

				expect(err).to.not.exist;

				db.find(collection, { string: "foo" }, undefined, function (err, result) {

					expect(err).to.not.exist;

					expect(result).to.equal("EMPTY_RESULT");

					done();
				});

			});

		});

	});

});