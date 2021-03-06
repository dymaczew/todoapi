const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, users, seedTodos, seedUsers} = require('./seed/seed');

beforeEach(seedUsers);
beforeEach(seedTodos);

describe('POST /todos', () => {
  it('should create new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err,res) => {
        if(err) {
          return done(err)
        }
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create todo with invalid request', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if(err) {
          return done(err)
        }
        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /todos', () => {
  it('should get 2 todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
      }
  )
});

describe('GET /todos:id', () => {
  it('should get specific todo by id', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
      }
  );

  it('should return todo not found when not existing id sent', (done) => {
    var fakeid = new ObjectID;
    request(app)
      .get(`/todos/${fakeid.toHexString()}`)
      .expect(404)
      .expect((res) => {
        expect(res.body.error).toBe('Todo not found');
      })
      .end(done);
  });

  it('should return invalid id when invalid id sent', (done) => {
    request(app)
      .get('/todos/123')
      .expect(404)
      .expect((res) => {
        expect(res.body.error).toBe('Invalid Todo id');
      })
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should delete specific todo by id', (done) => {
    var hexId = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toBeFalsy();
          done();
        }).catch((e) => done(e))
      });
  });

  it('should return todo not found when not existing id sent', (done) => {
    var fakeid = new ObjectID;
    request(app)
      .delete(`/todos/${fakeid.toHexString()}`)
      .expect(404)
      .expect((res) => {
        expect(res.body.error).toBe('Todo not found');
      })
      .end(done);
  });

  it('should return invalid todo when invalid id sent', (done) => {
    request(app)
      .delete('/todos/123')
      .expect(404)
      .expect((res) => {
        expect(res.body.error).toBe('Invalid Todo id')
      })
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should set specific todo as completed', (done) => {
    var patch = {
      text: "Patched todo",
      completed: true
    };
    request(app)
      .patch(`/todos/${todos[0]._id.toHexString()}`)
      .send(patch)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(patch.text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeGreaterThan(0);
      })
      .end(done);
  });

  it('should set specific todo as incompleted', (done) => {
    var patch = {
      text: "Patched todo",
      completed: false
    };
    request(app)
      .patch(`/todos/${todos[1]._id.toHexString()}`)
      .send(patch)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(patch.text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBe(null);
      })
      .end(done);
  });

  it('should return todo not found when not existing id sent', (done) => {
    var fakeid = new ObjectID;
    request(app)
      .patch(`/todos/${fakeid.toHexString()}`)
      .send({})
      .expect(404)
      .expect((res) => {
        expect(res.body.error).toBe('Todo not found');
      })
      .end(done);
  });

  it('should return invalid todo when invalid id sent', (done) => {
    request(app)
      .patch('/todos/123')
      .send({})
      .expect(404)
      .expect((res) => {
        expect(res.body.error).toBe('Invalid Todo id')
      })
      .end(done);
  });
});

describe('GET /users/me', () => {
  it('should return user if user exists and x-auth token is correct', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email)
      })
      .end(done);
  });

  it('should return 401 if wrong or no x-auth header provided', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  })
});

describe('POST /users', () => {
  it('should create new user', (done) => {
    var email = 'test@test.com';
    var password = 'test1234';

    request(app)
      .post('/users')
      .send({email,password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeDefined();
        expect(res.body.email).toBe(email);
      })
      .end((err,res) => {
        if(err) {
          return done(err)
        }
        User.find({email}).then((user) => {
          expect(user.length).toBe(1);
          expect(user[0].email).toBe(email);
          expect(user.password).not.toBe(password);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create user with invalid request', (done) => {
    request(app)
      .post('/users')
      .send({})
      .expect(400)
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        User.find({}).then((users) => {
          expect(users.length).toBe(2);
          done();
        }).catch((e) => done(e));
  });
});

  it('should not create user with already taken email address', (done) => {
    request(app)
      .post('/users')
      .send({email: users[0].email, password: users[0].password})
      .expect(400)
      .end((err, res) => {
        if(err) {
          return done(err)
        }
        User.find({}).then((users) => {
          expect(users.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });

});

describe('POST /users/login', () => {
  it('should login a valid user and send back token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.header['x-auth']).toBeTruthy()
      }).end((err, res) => {
        if (err) {
          done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens[0]).toMatchObject({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e) => done (e));
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: "something@example.com",
        password: "wrongpassword"
      })
      .expect(401)
      .expect((res) => {
        expect(res.header['x-auth']).toBeFalsy()
      }).end((err, res) => {
        if (err) {
          done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done (e));
      });
  });
});


