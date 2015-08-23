var express = require('express');
var router = express.Router();
var request = require('request');
var accessToken = require('./sessionToken.js');
var cspFramework = require('./csp-framework')();
var coursesEndpoint = 'https://canvas.instructure.com/api/v1';
// Unit is the mongoose schema for a Unit
var Unit = require('../app/models/lessonBuilderModel');

function appendQueryParams(path) {
	var queryParams = path.slice(path.indexOf('?') + 1);
	if(queryParams === "") {
		return "";
	} else {
		return "&" + queryParams;
	}
}

function getUnit(res){

				console.log(Unit);

		Unit.find(function(err, lessonItems) {

				// if there is an error retrieving, send the error. nothing after res.send(err) will execute
				if (err)
					res.send(err)

				console.log(lessonItems);
				res.json(lessonItems); // return all todos in JSON format
			});
	};

module.exports = function(app) {
	
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
	router.get('/api/unit', function(req, res) {

			// use mongoose to get all todos in the database
			console.log('/api/unit');
			getUnit(res);
	});

		// create todo and send back all todos after creation
	router.post('/api/lessonItems', function(req, res) {

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

		// delete a todo
	router.delete('/api/lessonItems/:lessonItem_id', function(req, res) {
		Todo.remove({
			_id : req.params.lessonItem_id
		}, function(err, todo) {
			if (err)
				res.send(err);

			getTodos(res);
		});
	});

	return router;
}
