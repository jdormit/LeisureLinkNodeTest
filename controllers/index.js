// Index controller

'use strict';

var express = require('express');
var router = express.Router();

// Route requests to appropriate controller
router.use('/movies', require('./movie'));
router.use('/actors', require('./actor'));
router.use('/directors', require('./director'));

// Handle requests to root
router.get('/', function (req, res, next) {
	res.render('index');
});

module.exports = router;