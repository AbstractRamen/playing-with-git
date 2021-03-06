require('./config/config.js');

const {ObjectID} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('../models/todos');
var {User} = require('../models/users');
const {authenticate} = require('./middleware/authenticate');

// var newDo = new Todo({
//   text: "Cook Lunch",
//   completed: true
// });
//
// var newUser = new User({
//   email: "heyhey@hey.com"
// })
//
// newDo.save().then((res)=> {
//   console.log(res)
// }, (e) =>{
//   console.log("Unable to save", e);
// })
//
// newUser.save().then((res)=>{
//   console.log(res)
// }, (e) => {
//   console.log("Unable to save user", e)
// })

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json())

app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var newUser = new User(body)

  newUser.save().then(() => {
    return newUser.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(newUser);
  }).catch((e) => {
    res.status(400).send(e)
  })

})

app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    })
  }).catch((e) => {
      res.status(400).send();
    });
  });


app.get('/users/me', authenticate, (req, res) => {
  // var token = req.header('x-auth');
  //
  // User.findByToken(token).then((user)=> {
  //   if(!user){
  //     return Promise.reject();
  //   }
  //
  //   res.send(user);
  // }).catch((e) => {
  //   res.status(401).send();
  // })
  res.send(req.user);
})

app.delete('/users/logout', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

app.post('/todos', authenticate, (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  })

  todo.save().then((saved)=> {
    res.send(saved);
  }, (e) => {
    res.status(400).send(e);
  })

});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({_creator: req.user._id}).then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e)
  })
});

app.get('/todo/:id', authenticate, (req, res) => {
  const id = req.params.id;

  if(!ObjectID.isValid(id)){
    res.status(404).send();
  }

  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if(!todo){
      return res.status(404).send();
    };
    res.status(200).send(todo)
  }, (e) => {
    res.status(400).send();
  });

});

app.delete('/todo/:id', authenticate, (req, res) => {
  const todoId = req.params.id;

  if(!ObjectID.isValid(todoId)){
    return res.status(404).send();
  }

  Todo.findOneAndDelete({
    _id: todoId,
    _creator: req.user._id
  }).then((result) => {
    if (!result){
      return res.status(404).send();
    };

    res.send({result});

  }).catch((e) => {
    res.status(400).send();
  })
})

app.patch('/todo/:id', authenticate, (req, res) => {
  const todoId = req.params.id;
  const body = _.pick(req.body, ['text', 'completed']);

  if(!ObjectID.isValid(todoId)) {
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  } else {
    body.completedAt = null;
    body.completed = false;
  }

  Todo.findOneAndUpdate({
    _id: todoId,
    _creator: req.user._id
  }, {$set: body}, {new: true}).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }

    res.status(200).send(todo);

  }).catch((e) => {
    return res.send(400).send();
  })


})

app.listen(port, ()=> {
  console.log(`Started on port ${port}`);
});


module.exports = {app};
