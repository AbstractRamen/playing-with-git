const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {mongoose} = require('mongoose');
const {app} = require('./../server');
const {Todo} = require('./../../models/todos');
const {User} = require('./../../models/users');
const {samptodos, populateTodos, testUsers, populateUsers} = require('./seed/seed.js');

// const samptodos = [{
//   _id: new ObjectID,
//   text: "First"
// }, {
//   _id: new ObjectID,
//   text: 'Second',
//   completed: false,
//   completedAt: 333
// }]

beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe('GET for /todos', () => {
  it('should grab all to-dos', (done) => {
    request(app)
      .get('/todos')
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      }).end(done);
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

describe('GET /users/me', () => {
  it('it should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', testUsers[0].tokens[0].token)
      .expect((res) => {
        expect(res.body.email).toBe(testUsers[0].email)
        expect(res.body._id).toBe(testUsers[0]._id.toHexString())
      }).end(done);
  })

  it('it should return a 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', 'fakeToken')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  })
})

describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'ememem@gmail.com';
    var password = 'passmannn';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.header['x-auth']).toBeTruthy();
        expect(res.body.email).toBe(email);
        expect(res.body._id).toBeTruthy();
      }).end((err) => {
        if(err){
          return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user.email).toBe(email);
          expect(user.password).not.toBe(password);
          done();
        })
      });
  })

  it('should return validation errors if request invalid', (done) => {
    var email = 'ememem@gmail.com';
    var password = 'pass';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  })

  it('should not create a user if email in use', (done) => {
    var usedEmail = 'heyhey@aol.com';
    var password = 'asdasdasd';

    request(app)
      .post('/users')
      .send({email: usedEmail, password})
      .expect(400).end(done);
  })
})

describe('POST /users/login', () => {
  it('should reject invalid credentials', (done) => {
    var email = testUsers[1].email;
    var password = 'poopoo';


    request(app)
      .post('/users/login')
      .send({email, password})
      .expect(400)
      .expect((res) => {
        expect(res.header['x-auth']).toBeFalsy();
      })
      .end((err, res) => {
        if(err){
          return done(err)
        }

        User.findById({_id: testUsers[1]._id}).then((user)=> {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      })
  })

  it('should accept valid credentials and record a token', (done) => {
    var email = testUsers[0].email;
    var password = testUsers[0].password;


    request(app)
      .post('/users/login')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.body.email).toBe(testUsers[0].email);
        expect(res.body._id).toBe(testUsers[0]._id.toHexString());
        expect(res.header['x-auth']).toBeTruthy();
      })
      .end((err, res) => {
        if(err){
          return done(err)
        }

        User.findById({_id: testUsers[0]._id}).then((user) => {
          expect(user.tokens[1]).toMatchObject({
            access: 'auth',
            token: res.header['x-auth']
          });
          done();
        }).catch((e) => done(e))
      });

  })
})

describe('DELETE /users/logout', () => {
  it('removes the token upon valid token receiving', (done) => {
    var token = testUsers[0].tokens[0].token

    request(app)
      .delete('/users/logout')
      .set('x-auth', token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        User.findById({_id: testUsers[0]._id}).then((user) => {
          expect(user.tokens.length).toBe(0)
          done();
        }).catch((e) => done(e));
      })
  })
})
