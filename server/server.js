const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var port = process.env.PORT || 3000;

const {ObjectID} = require('mongodb');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  })
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  },(e) => {
    res.send(e);
  });
});

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send({
      error: 'Invalid Todo id'
    });
  };

  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(404).send({
        error: 'Todo not found'
      });
    }
    res.status(200).send({todo});
  }, (e) => {
    return res.status(400).send(e);
  });
});

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send({
      error: 'Invalid Todo id'
    });
  };

  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) {
      return res.status(404).send({
        error: 'Todo not found'
      });
    }
    res.status(200).send({todo});
  }, (e) => {
    return res.status(400).send(e);
  });
});

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send({
      error: 'Invalid Todo id'
    });
  };

  var body = _.pick(req.body, ['text', 'completed']);
  if (_.isBoolean(body.completed)) {
    if (!body.completed) {
      body.completedAt = null
    } else {
      body.completedAt = Date.now();
    }
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send({
        error: 'Todo not found'
      });
    }
    res.status(200).send({todo});
  }, (e) => {
    return res.status(400).send(e);
  });

});

app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});


app.listen(port, () => {
  console.log(`Started on port ${port}`);
})

module.exports = {app};
