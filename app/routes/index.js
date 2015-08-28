var express = require('express');
var router = express.Router();
var request = require('request');
var accessToken = require('./sessionToken.js');
var cspFramework = require('./csp-framework')();
var coursesEndpoint = 'https://canvas.instructure.com/api/v1';

var mongoose = require('mongoose');           // mongoose for mongodb
// configuration ===============================================================
mongoose.connect('mongodb://localhost/todw', function(err) {
    if(err) {
        console.log('connection error', err);
    } else {
        console.log('connection successful');
    }
});

// Unit is the mongoose schema for a Unit
var UnitMetadata = require('../models/unitMetadata');

function appendQueryParams(path) {
	var queryParams = path.slice(path.indexOf('?') + 1);
	if(queryParams === "") {
		return "";
	} else {
		return "&" + queryParams;
	}
}

function createUnit(res) {
	Unit.create();
}

function getUnits(res){

	Unit.find(function(err, units) {

				// if there is an error retrieving, send the error. nothing after res.send(err) will execute
	if (err)
		res.send(err)

		console.log(units);
		res.json(units); // return all units in JSON format
	});
}

router.use('/api/canvas', function (req, res, next) {

	// console.log('The sessionKey = ', accessToken.sessionKey());
	var url = coursesEndpoint + req.path +
				'?access_token=' + accessToken.sessionKey() + appendQueryParams(req.originalUrl);
	console.log(url);

	var options = {
	  url: url,
	  headers: {
	    'Accept': 'application/json'
	  }
	};

	request(options, function (err, resp, body) {
			// console.log("response headers: ", resp.headers);
		if (!err && resp.statusCode == 200) {
			res.set(resp.headers);
			res.send(body);
		} else {
			res.send(err);
		}
	});
});

router.get('/api/csp-framework', function (req, res) {
    res.send(cspFramework);
});
	

		// api ---------------------------------------------------------------------
	// get all the unit and the lessons
router.get('/api/units', function(req, res) {

		// use mongoose to get unit with the canvasUnitID in the database
		console.log('/api/units');
	UnitMetadata.find(function(err, unitMetadata) {

				// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err)
			res.send(err)

		console.log(unitMetadata);
		res.json(unitMetadata); // return all units in JSON format
	
	});

});

	// create todo and send back all todos after creation
router.post('/api/unit', function(req, res) {

	// create a todo, information comes from AJAX request from Angular
	LessonItem.create({
		text : req.body.text,
		done : false
	}, function(err, lessonItem) {
		if (err)
			res.send(err);

		// get and return all the todos after you create another
		getLessonItems(res);
	});

});

/* PUT /units/:id */
router.put('/:id', function(req, res, next) {
  Todo.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

	// delete a todo
router.delete('/api/unit/:unit_id', function(req, res) {
	Todo.remove({
		_id : req.params.lessonItem_id
	}, function(err, todo) {
		if (err)
			res.send(err);

		getTodos(res);
	});
});

module.exports = router;
