var mongoose = require('mongoose');

var POSSIBLE_IDS = ['courseId', 'unitId', 'activityId'];

var fields = POSSIBLE_IDS.reduce(function (accumulator, idName) {
    accumulator[idName] = { type: Number };
    return accumulator;
}, {});

function hasAtLeastOneId (document) {
    return POSSIBLE_IDS.some(function (idName) {
        return document[idName];
    });
}

fields.content = {
    type: String,
    required: true
};

fields.activityType = {
    type: String
};

var tagSchema = new mongoose.Schema(fields);

tagSchema.pre('validate', function (next) {
    if (hasAtLeastOneId(this)) {
        next();
    } else {
        next(Error('One of ' + POSSIBLE_IDS.join(', ') + ' must be provided.'))
    }
});

tagSchema.POSSIBLE_IDS = POSSIBLE_IDS;

module.exports = mongoose.model('Tag', tagSchema);

