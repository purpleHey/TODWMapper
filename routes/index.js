var express = require('express');
var router = express.Router();
var request = require('request');
var accessToken = "7~PBUEpEjESZrm0w9l91WZKk5gOtAggzGCN3s29hkCtnl1cdq6GLLY4Hocrr9iHSr0";
var coursesEndpoint = 'https://canvas.instructure.com/api/v1';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Instructure' });
});

router.use('/api/canvas', function (req, res, next) {

	var url = coursesEndpoint + req.path + '?per_page=100&access_token=' + accessToken;
	
	request(url, function (err, resp, body) {
		// console.log("response headers: ", resp.headers);
		if (!err && resp.statusCode == 200) {
			res.send(body);
		} else {
			res.send(err);
		}
	});
});

module.exports = router;
