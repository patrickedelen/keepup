var mongoose = require('mongoose');

module.exports = mongoose.model('Video', {
	url: {type: String, unique: true},
	title: {type: String},
	date: {type: Date},
	status: {type: Boolean}
});