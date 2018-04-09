var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var mongoHost = process.env.MONGO_HOST || 'localhost';
var mongoPort = process.env.MONGO_PORT || 27017;
var env = process.env.NODE_ENV || 'development';

if (env === 'production' || env === 'development') {
  var dbName = 'TodoApp';
} else {
  var dbName = 'TodoAppTest';
}

mongoose.connect(`mongodb://${mongoHost}:${mongoPort}/${dbName}`);

module.exports = {mongoose};
