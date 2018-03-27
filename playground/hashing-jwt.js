const jwt = require('jsonwebtoken');

var data = {
  id: 10
}

var token = jwt.sign(data, 'secret');
var decoded = jwt.verify(token, 'secret');

console.log('decoded:', decoded);
