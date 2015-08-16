var express = require('express');
var router = express.Router();
var request = require('request');
var accessToken = require('./sessionToken.js');
var coursesEndpoint = 'https://canvas.instructure.com/api/v1';

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Instructure' });
// });

function appendQueryParams(path) {
	var queryParams = path.slice(path.indexOf('?') + 1);
	if(queryParams === "") {
		return "";
	} else {
		return "&" + queryParams;
	}
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

module.exports = router;
