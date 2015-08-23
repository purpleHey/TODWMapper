var mongoose = require('mongoose');

var unitSchema = new mongoose.Schema({
	name: {type: String, required: true, unique: true},
	description: {type: String, required: true, unique: true},
	lessons : {type : Array, default: ''},
	updated_at : {type : Date, default: ''},
});

// mongoose.model compiles the schema into a model, and the model is the class
// which is used to create documents.
module.exports = mongoose.model('Unit', unitSchema);

