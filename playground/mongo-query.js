const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');

var id = '5a4dfd96f1423528fab4f097';

// Todo.find({
//   _id: id
//   }).then((todo)=> {
//   console.log('1: '+ todo);
// }, (e) => {
//   console.log(e);
// });
//
// Todo.findOne({
//   _id: id
//   }).then((todo)=> {
//   console.log('2: '+ todo);
// }, (e) => {
//   console.log(e);
// });
//
// Todo.findById(id).then((todo)=> {
// console.log('3: '+ todo);
// }, (e) => {
// console.log(e);
// });

User.findById(id).then((user)=> {
  if (!user) {
    return console.log('User not found');
  }
  console.log('User:', user);
}).catch((e) => {
console.log(e);
});
