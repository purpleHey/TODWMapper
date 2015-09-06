var router = require('express').Router();
var Tag = require('../models/tag');
var respondWithQuery = require('./utils').respondWithQuery;

function slice (object, keys) {
    return keys.reduce(function (result, key) {
        if (object.hasOwnProperty(key)) {
            result[key] = object[key];
        }
        return result;
    }, {});
}

router.get('/api/tags', respondWithQuery(function (req) {
    var params = slice(req.query, Tag.schema.POSSIBLE_IDS);
    Object.keys(params).forEach(function (key) {
        params[key] = parseInt(params[key], 10);
    });
    return Tag.find(params);
}));

router.get('/api/tags/:id', respondWithQuery(function (req) {
    return Tag.findById(req.params.id);
}));

router.post('/api/tags', respondWithQuery(function (req) {
    return Tag.create(req.body);
}, 201));

router.put('/api/tags/:id', respondWithQuery(function (req) {
    return Tag.findByIdAndUpdate(req.params.id, req.body);
}, 204));

router.delete('/api/tags/:id', respondWithQuery(function (req) {
    return Tag.findByIdAndRemove(req.params.id);
}, 204));

module.exports = router;
