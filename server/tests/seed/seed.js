const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../../models/todos.js');
const {User} = require('./../../../models/users.js');

const userOneId = new ObjectID;
const userTwoId = new ObjectID;

const samptodos = [{
  _id: new ObjectID,
  text: "First",
  _creator: userOneId
}, {
  _id: new ObjectID,
  text: 'Second',
  completed: false,
  completedAt: 333,
  _creator: userTwoId
}]

const testUsers = [{
  _id: userOneId,
  email: 'honeyfoofoo@gmail.com',
  password: 'user1pass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}, {
  _id: userTwoId,
  email: 'heyhey@aol.com',
  password: 'user2pass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
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
