'use strict';

var expect = require('chai').expect;
var actor = require('../models/actor');

describe('Actor Model', function () {
	
	describe('Create Actor', function () {

		it('creates a new actor', function (done) {

			var name = "Al Pacino";
			var age = 76;
			var gender = 'M';
			var agent = "ICM Partners";
			var filmography = ["The Godfather", "The Godfather: Part 2", "Scarface"];

			actor.create(name, age, gender, agent, filmography, function (error) {

			});

		});

	});

});