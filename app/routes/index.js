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

router.use('/api/canvas', function (req, res, next) {

    // console.log('The sessionKey = ', accessToken.sessionKey());
    var url = coursesEndpoint + req.path +
                '?per_page=100&access_token=' + accessToken.sessionKey() + appendQueryParams(req.originalUrl);
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

function respondWithQuery (fn, successCode) {
    successCode || (successCode = 200);

    return function (req, res, next) {
        function onSuccess (result) {
            res.status(successCode);
            if (result && successCode !== 204) {
                res.json(result);
            } else {
                res.end();
            }
        }

        fn(req).then(onSuccess, next);
    }
}

router.get('/api/units', respondWithQuery(function (req) {
    return UnitMetadata.find();
}));

router.get('/api/units/:id', respondWithQuery(function (req) {
    return UnitMetadata.find({ moduleID: req.params.id }).then(function (metas) {
        return metas.map(function (meta) { return meta.learningObjective; });
    });
}));

router.post('/api/units', respondWithQuery(function (req) {
    return UnitMetadata.assign(req.body.moduleID, req.body.learningObjectives);
}, 201));

router.put('/api/units/:id', respondWithQuery(function (req) {
    return UnitMetadata.clear(req.params.id).then(function () {
        return UnitMetadata.assign(req.params.id, req.body);
    });
}));

router.delete('/api/units/:id', respondWithQuery(function (req) {
    return UnitMetadata.clear(req.params.id);
}, 204));

module.exports = router;
