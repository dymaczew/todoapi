const {SHA256} = require('crypto-js');
const bcrypt = require('bcryptjs');

var password = 'abc123$%^';

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  })
})

bcrypt.compare('abc123$%6', '$2a$10$wuhIrWTugishZpdR.Pr9/edZqPT.02pyXHatcaTvN9VWL3QNKNwbO', (err, res) => {
  console.log(res);
})

//
// var hashedPassword =
//
// var message = 'Przykładowy łańcuch znaków 2';
// var hash = SHA256(message).toString();
//
// console.log(`This is message ${message}`);
// console.log(`This is hash ${hash}`);
//
// var data = {
//   id: 5
// };
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'secret').toString()
// }
//
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(data)).toString();
//
// var resultHash = SHA256(JSON.stringify(token.data)  + 'secret').toString();
//
// if (token.hash === resultHash) {
//   console.log('Hash correct, data not manipulated')
// } else {
//   console.log('Data manipulated, discard')
// };
