var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var mongoHost = process.env.MONGO_HOST || 'localhost';
var mongoPort = process.env.MONGO_PORT || 27017;

mongoose.connect(`mongodb://${mongoHost}:${mongoPort}/TodoApp`);

module.exports = {mongoose};
