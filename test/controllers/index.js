// Unit tests for index controller

var chai = require('chai');
var chai_http = require('chai-http');
chai.use(chai_http);

var expect = chai.expect;
var request = chai.request;

var app = "http://localhost:3000";

describe('Index controller', function () {

	it('responds to requests for root', function (done) {

		request(app)
			.get('/')
			.end(function (error, result) {

				expect(error).to.not.exist;
				expect(result).to.have.status(200);

				done();
			});

	});

	it('responds to nonexistant pages with a 404 error', function (done) {

		request(app)
			.get('/foo')
			.end(function (error, result) {

				expect(error).to.exist;
				expect(result).to.have.status(404);

				done();
			});

	});
});