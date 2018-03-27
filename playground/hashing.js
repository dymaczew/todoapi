const {SHA256} = require('crypto-js');

var message = 'Przykładowy łańcuch znaków 2';
var hash = SHA256(message).toString();

console.log(`This is message ${message}`);
console.log(`This is hash ${hash}`);

var data = {
  id: 5
};

var token = {
  data,
  hash: SHA256(JSON.stringify(data) + 'secret').toString()
}

token.data.id = 5;
token.hash = SHA256(JSON.stringify(data)).toString();

var resultHash = SHA256(JSON.stringify(token.data)  + 'secret').toString();

if (token.hash === resultHash) {
  console.log('Hash correct, data not manipulated')
} else {
  console.log('Data manipulated, discard')
};
