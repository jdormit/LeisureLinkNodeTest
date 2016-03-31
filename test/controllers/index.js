// Unit tests for index controller

var chai = require('chai');
var chai_http = require('chai-http');
chai.use(chai_http);

var expect = chai.expect;
var request = chai.request;

describe('Index controller', function () {
	var app;
	beforeEach(function () {
		// create a new server instance for each test
		delete require.cache[require.resolve('../../app')];
		app = require('../../app');
	});
	afterEach(function () {
		// close the server after each test
		app.close();
	});

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