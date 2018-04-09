const {ObjectID} = require('mongodb');
const {Todo} = require('../../models/todo');
const {User} = require('../../models/user');
const jwt = require('jsonwebtoken');

var userOneID = new ObjectID();
var userTwoID = new ObjectID();

const users = [{
  _id: userOneID,
  email: 'userone@example.com',
  password: 'PasswordUserOne!',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneID, access: 'auth'}, 'secret').toString()
  }]
}, {
  _id: userTwoID,
  email: 'usertwo@example.com',
  password: 'PasswordUserTwo!'
}];


const todos = [{
  _id: new ObjectID,
  text: 'First test todo',
  completed: false
}, {
  _id: new ObjectID,
  text: 'Second test todo',
  completed: true,
  completedAt: Date.now()
}];

const seedTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
};

const seedUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo])
  }).then(() => done());
};

module.exports = {todos, users, seedTodos, seedUsers};
