const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../../models/todos.js');
const {User} = require('./../../../models/users.js');

const samptodos = [{
  _id: new ObjectID,
  text: "First"
}, {
  _id: new ObjectID,
  text: 'Second',
  completed: false,
  completedAt: 333
}]

const userOneId = new ObjectID;
const userTwoId = new ObjectID;

const testUsers = [{
  _id: userOneId,
  email: 'honeyfoofoo@gmail.com',
  password: 'user1pass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
  }]
}, {
  _id: userTwoId,
  email: 'heyhey@aol.com',
  password: 'user2pass'
}]

const populateTodos = (done) => {
  Todo.deleteMany({}).then(() => {
    return Todo.insertMany(samptodos).then(()=> done())});
};

const populateUsers = (done) => {
  User.deleteMany({}).then(() => {
    var userOne = new User(testUsers[0]).save();
    var userTwo = new User(testUsers[1]).save();

    return Promise.all([userOne, userTwo])
  }).then(() => {
    done();
  })
}

module.exports = {samptodos, populateTodos, testUsers, populateUsers}
