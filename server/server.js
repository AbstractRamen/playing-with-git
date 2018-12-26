const {ObjectID} = require('mongodb');
var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('../models/todos');
var {User} = require('../models/users');

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

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  })

  todo.save().then((saved)=> {
    res.send(saved);
  }, (e) => {
    res.status(400).send(e);
  })

})

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e)
  })
})

app.get('/todo/:id', (req, res) => {
  const id = req.params.id;

  if(!ObjectID.isValid(id)){
    res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }
    res.status(200).send(todo)
  }, (e) => {
    res.status(400).send();
  })

})

app.listen(port, ()=> {
  console.log(`Started on port ${port}`);
})



module.exports = {app};
