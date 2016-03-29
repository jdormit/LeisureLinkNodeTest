// Tests for db.close, put in a separate file to be run after all model tests have completed

var expect = require('chai').expect;
var db = require('../db');

describe('Close the database', function () {
	
	it('closes database correctly', function (done) {

		db.close(function (error) {

			expect(error).to.not.exist;

			expect(db.get()).to.not.exist;

			done();
		});

	});

});