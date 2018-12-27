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
  text: 'Second'
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
