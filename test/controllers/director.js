// Unit tests for director controller

var chai = require('chai');
var chai_http = require('chai-http');
chai.use(chai_http);

var expect = chai.expect;
var request = chai.request;

describe('Director controller', function () {
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
	
	it('responds to POST /directors by adding a director', function (done) {
		
		var director = {
			name: "J.J. Abrams",
			age: 50,
			gender: 'M',
			directed: ["Star Wars: The Force Awakens", "Star Trek Into Darkness"]
		};

		request(app)
			.post('/directors/')
			.send(director)
			.end(function (error, response) { 
		
			expect(error).to.not.exist;
			expect(response).to.have.status(200);

			done();
		});
	
	});

	it('responds to GET /directors with a list of all directors', function (done) {
		

		request(app)
			.get('/directors')
			.end(function (error, response) {
			
			expect(error).to.not.exist;
			expect(response).to.have.status(200);
			expect(response).to.be.json;
			expect(response.body).to.be.a('array');
		
			done();
		});
	
	});

	it('responds to GET /directors/:director with the requested director', function (done) { 
	
		request(app)
			.get('/directors/jjabrams')
			.end(function (error, response) { 
		
			expect(error).to.not.exist;
			expect(response).to.have.status(200);
			expect(response).to.be.json;
			expect(response.body.id).to.equal("jjabrams");
			expect(response.body.name).to.equal("J.J. Abrams");
			expect(response.body.age).to.equal(50);
			expect(response.body.gender).to.equal('M');
			expect(response.body.directed).to.deep.equal(["Star Wars: The Force Awakens", "Star Trek Into Darkness"]);

			done();
		})
	
	});

	it('responds to PUT /directors/:director by updating that director', function (done) {
		
		var update = {
			name: "Wes Anderson",
			age: 47,
			directed: ["Moonrise Kingdom", "The Grand Budapest Hotel"]
		};

		request(app)
			.put('/directors/jjabrams')
			.send(update)
			.end(function (error, response) { 
		
			expect(error).to.not.exist;
			
			expect(response).to.have.status(200);

			request(app)
				.get('/directors/wesanderson')
				.end(function (error, response) {
				expect(error).to.not.exist;
				
				expect(response).to.have.status(200);
				expect(response).to.be.json;
				expect(response.body.id).to.equal("wesanderson");
				expect(response.body.name).to.equal("Wes Anderson");
				expect(response.body.age).to.equal(47);
				expect(response.body.gender).to.equal('M');
				expect(response.body.directed).to.deep.equal(["Moonrise Kingdom", "The Grand Budapest Hotel"]);

				done()
			});
		});	
	});

	it('responds to DELETE /directors/:director by deleting that director', function (done) { 
	
		request(app)
			.delete('/directors/wesanderson')
			.end(function (error, response) { 
		
			expect(error).to.not.exist;
			expect(response).to.have.status(200);
			
			request(app)
				.get('/directors/wesanderson')
				.end(function (error, response) { 
			
				expect(error).to.exist;
				expect(response).to.have.status(404);

				done();
			});
		});
	});
});