// Unit tests for actor controller

var chai = require('chai');
var chai_http = require('chai-http');
chai.use(chai_http);

var expect = chai.expect;
var request = chai.request;

var app = "http://localhost:3000";

describe("Actor controller", function () {

	it('responds to POST /actors by adding an actor', function (done) {
		
		var actor = {
			name: "Al Pacino",
			age: 76,
			gender: 'M',
			agent: "ICM Partners",
			filmography: ["The Godfather", "The Godfather: Part 2", "Scarface"]
		};
		
		request(app)
			.post('/actors')
			.send(actor)
			.end(function (error, response) {
			
			expect(error).to.not.exist;
			expect(response).to.have.status(200);
			
			done();
		});
	});

	it('responds to GET /actors with a list of all actors', function (done) {
		
		
		request(app)
			.get('/actors')
			.end(function (error, response) {
			
			expect(error).to.not.exist;
			expect(response).to.have.status(200);
			expect(response).to.be.json;
			expect(response.body).to.be.a('array');
			
			done();
		});
	});

	it('responds to GET /actors/:actor with the requested actor', function (done) {
		
		request(app)
			.get('/actors/alpacino')
			.end(function (error, response) {
			
			expect(error).to.not.exist;
			expect(response).to.have.status(200);
			expect(response).to.be.json;
			expect(response.body.id).to.equal("alpacino");
			expect(response.body.name).to.equal("Al Pacino");
			expect(response.body.age).to.equal(76);
			expect(response.body.gender).to.equal('M');
			expect(response.body.agent).to.equal("ICM Partners");
			expect(response.body.filmography).to.deep.equal(["The Godfather", "The Godfather: Part 2", "Scarface"]);
			
			done();
		});
	});

	it('responds to PUT /actors/:actor by updating that actor', function (done) {
		
		var update = {
			name: "Harrison Ford",
			age: 73,
			agent: "Patricia McQueeney",
			filmography: ["Star Wars: A New Hope", "Indian Jones: The Last Crusade"]
		};
		
		request(app)
			.put('/actors/alpacino')
			.send(update)
			.end(function (error, response) {
			
			expect(error).to.not.exist;
			
			expect(response).to.have.status(200);
			
			request(app)
				.get('/actors/harrisonford')
				.end(function (error, response) {
				expect(error).to.not.exist;
				
				expect(response).to.have.status(200);
				expect(response).to.be.json;
				expect(response.body.id).to.equal("harrisonford");
				expect(response.body.name).to.equal("Harrison Ford");
				expect(response.body.age).to.equal(73);
				expect(response.body.gender).to.equal('M');
				expect(response.body.agent).to.equal("Patricia McQueeney");
				expect(response.body.filmography).to.deep.equal(["Star Wars: A New Hope", "Indian Jones: The Last Crusade"]);
				
				done()
			});
		});
	});

	it('responds to DELETE /actors/:actor by deleting that actor', function (done) {
		
		request(app)
			.delete('/actors/harrisonford')
			.end(function (error, response) {
			
			expect(error).to.not.exist;
			expect(response).to.have.status(200);
			
			request(app)
				.get('/actors/harrisonford')
				.end(function (error, response) {
				
				expect(error).to.exist;
				expect(response).to.have.status(404);
				
				done();
			});
		});
	});
});