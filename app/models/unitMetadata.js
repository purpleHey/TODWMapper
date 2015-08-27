var mongoose = require('mongoose');

var unitMetadataSchema = new mongoose.Schema({
	canvasID: {type: Number, required: true, unique: true},
	learningObjectives : {type : Array, default: ''},
});

// mongoose.model compiles the schema into a model, and the model is the class
// which is used to create documents.
module.exports = mongoose.model('UnitMetadata', unitMetadataSchema);

