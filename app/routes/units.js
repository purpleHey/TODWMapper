var router = require('express').Router();
var UnitMetadata = require('../models/unitMetadata');
var respondWithQuery = require('./utils').respondWithQuery;

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
