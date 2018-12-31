const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {mongoose} = require('mongoose');
const {app} = require('./../server');
const {Todo} = require('./../../models/todos');

const samptodos = [{
  _id: new ObjectID,
  text: "First"
}, {
  _id: new ObjectID,
  text: 'Second',
  completed: false,
  completedAt: 333
}]

beforeEach((done) => {
  Todo.deleteMany({}).then(() => {
    return Todo.insertMany(samptodos).then(()=> done())});
})

describe('POST /todos', () => {
  it('should create a new to do', (done) => {
    const text = "Testing todos";

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text)
      })
      .end((err, res) => {
        if(err) {
          return done(err)
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e)=> {
          done(e);
        })
      })
  });

  it('should not save a bad entry', (done) => {
    const text = "";

    request(app)
      .post('/todos')
      .send({text})
      .expect(400)
      .end((err, res) => {
        if(err) {
          return done(err)
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done()
        }).catch((err) => {
          done(err);
        })
      })
  })
})

describe('GET for /todo/:id', ()=> {
  it('should return a todo', (done) => {
    request(app)
      .get(`/todo/${samptodos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(samptodos[0].text)
      })
      .end(done);
  })

  it('should return a 404 if to do is not found', (done) => {
    request(app)
      .get(`/todo/${samptodos[0]._id.toHexString()[0,-2] + '2'}`)
      .expect(404)
      .end(done);
  })

  it('should return a 404 for a nonvalid ID', (done) => {
    request(app)
      .get(`/todo/${samptodos[0]._id + '231'}`)
      .expect(404)
      .end(done);
  })
})

describe('DELETE for /todo/:id', () => {
  it('should remove a todo', (done) => {
    const testId = samptodos[1]._id.toHexString();

    request(app)
      .delete(`/todo/${testId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.result._id).toBe(testId)
      }).end((err, res) => {
        if (err){
          return done(err);
        }

      Todo.findById(testId).then((todo) => {
        expect(todo).toBe(null);
        done();
      }).catch((e) => done(e))
    });
  });

  it('should return a 404 if todo not found', (done) => {
    request(app)
      .delete(`/todo/${samptodos[0]._id.toHexString()[0,-2] + '2'}`)
      .expect(404)
      .end(done)
  })

  it('should return a 404 if invalid ID', (done) => {
    request(app)
      .delete('/todo/123')
      .expect(404)
      .end(done)
  })
})

describe('PATCH /todo/:id', () => {
  it('should update the todo', (done) => {

    const todoId = samptodos[1]._id.toHexString();
    const text = "Updated"

    request(app)
      .patch(`/todo/${todoId}`)
      .send({
        completed: true,
        text
      }).expect(200)
      .expect((todo) => {
        expect(todo.body.text).toBe(text);
        expect(todo.body.completed).toBe(true);
        expect(typeof todo.body.completedAt).toBe('number');
        // expect(todo.body.result.completed).toBe(false);
        // expect(typeof todo.body.result.completedAt).toBe("Number");

      }).end(done);
    // Grab id of first item
    // Patch request & update text + set completed to true
    // Assert 200 + response has text property changed & completed is true & completedAt is a number
  })

  it('should clear when completed is set to false', (done) => {
    // Grab id of second item
    // Patch request & update text + set completed to false
    // Assert 200 + response has text property changed & completed is false & completedAt is null
    const todoId = samptodos[0]._id.toHexString();

    request(app)
      .patch(`/todo/${todoId}`)
      .send({
        completed: false
      }).expect(200)
      .expect((todo) => {
        expect(todo.body.completed).toBe(false);
        expect(todo.body.completedAt).toBeNull();
      }).end(done)
  })
})
