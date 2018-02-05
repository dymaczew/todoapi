const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

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


beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

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
    request(app)
      .delete(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
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
