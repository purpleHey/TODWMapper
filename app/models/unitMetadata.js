var mongoose = require('mongoose');

var unitMetadataSchema = new mongoose.Schema({
	moduleID: {type: Number, required: true},
	learningObjective: {type: String, required: true},
});

unitMetadataSchema.statics.assign = function (moduleID, learningObjectives) {
    return this.create(learningObjectives.map(function (learningObjective) {
        return {
            moduleID: moduleID,
            learningObjective: learningObjective
        }
    }));
}

unitMetadataSchema.statics.clear = function (moduleID) {
    return this.remove({ moduleID: moduleID });
}

// mongoose.model compiles the schema into a model, and the model is the class
// which is used to create documents.
module.exports = mongoose.model('UnitMetadata', unitMetadataSchema, 'unitsMetadata');

