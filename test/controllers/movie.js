// Unit tests for movie controller

var chai = require('chai');
var chai_http = require('chai-http');
chai.use(chai_http);

var expect = chai.expect;
var request = chai.request;

var app = "http://localhost:3000";

describe("Movie controller", function () {
	
	it('responds to POST /movies by adding a movie', function (done) {
		
		var movie = {
			title : "The Godfather",
			description : "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
			release_year : 1972,
			rating : 9.2,
			actors : ["Marlon Brando", "Al Pacino", "James Caan"],
			directors : ["Francic Ford Coppola"]
		}
		
		request(app)
			.post('/movies/')
			.send(movie)
			.end(function (error, response) {
			
			expect(error).to.not.exist;
			expect(response).to.have.status(200);
			
			done();
		});
	});

	it('responds to GET /movies with a list of all movies', function (done) {
		
		
		request(app)
			.get('/movies')
			.end(function (error, response) {
			
			expect(error).to.not.exist;
			expect(response).to.have.status(200);
			expect(response).to.be.json;
			expect(response.body).to.be.a('array');
			
			done();
		});
	});

	it('responds to GET /movies/:movie with the requested movie', function (done) {
		
		request(app)
			.get('/movies/thegodfather')
			.end(function (error, response) {
			
			expect(error).to.not.exist;
			expect(response).to.have.status(200);
			expect(response).to.be.json;
			expect(response.body.id).to.equal("thegodfather");
			expect(response.body.title).to.equal("The Godfather");
			expect(response.body.description).to.equal("The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.");
			expect(response.body.release_year).to.equal(1972);
			expect(response.body.rating).to.equal(9.2);
			expect(response.body.actors).to.deep.equal(["Marlon Brando", "Al Pacino", "James Caan"]);
			expect(response.body.directors).to.deep.equal(["Francic Ford Coppola"]);
			
			done();
		});
	});

	it('responds to PUT /movies/:movie by updating that movie', function (done) {
		
		var update = {
			title: "The Godfather: Part 2",
			description: "The early life and career of Vito Corleone in 1920s New York is portrayed while his son, Michael, expands and tightens his grip on his crime syndicate stretching from Lake Tahoe, Nevada to pre-revolution 1958 Cuba.",
			year_released: 1974,
			rating: 9.0,
			actors: ["Al Pacino", "Robert De Niro"],
			directors: ["J.J. Abrams"]
		};
		
		request(app)
			.put('/movies/thegodfather')
			.send(update)
			.end(function (error, response) {
			
			expect(error).to.not.exist;
			
			expect(response).to.have.status(200);
			
			request(app)
				.get('/movies/thegodfatherpart2')
				.end(function (error, response) {

				expect(error).to.not.exist;
				expect(response).to.have.status(200);
				expect(response).to.be.json;
				expect(response.body.id).to.equal("thegodfatherpart2");
				expect(response.body.title).to.equal("The Godfather: Part 2");
				expect(response.body.description).to.equal("The early life and career of Vito Corleone in 1920s New York is portrayed while his son, Michael, expands and tightens his grip on his crime syndicate stretching from Lake Tahoe, Nevada to pre-revolution 1958 Cuba.");
				expect(response.body.release_year).to.equal(1974);
				expect(response.body.rating).to.equal(9.0);
				expect(response.body.actors).to.deep.equal(["Al Pacino", "Robert De Niro"]);
				expect(response.body.directors).to.deep.equal(["J.J. Abrams"]);
				
				done();
			});
		});
	});

	it('responds to DELETE /movies/:movie by deleting that movie', function (done) {
		
		request(app)
			.delete('/movies/thegodfatherpart2')
			.end(function (error, response) {
			
			expect(error).to.not.exist;
			expect(response).to.have.status(200);
			
			request(app)
				.get('/movies/thegodfatherpart2')
				.end(function (error, response) {
				
				expect(error).to.exist;
				expect(response).to.have.status(404);
				
				done();
			});
		});
	});
});