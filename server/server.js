var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todos');
var {User} = require('./models/users');

var newDo = new Todo({
  text: "Cook Lunch",
  completed: true
});

var newUser = new User({
  email: "heyhey@hey.com"
})

newDo.save().then((res)=> {
  console.log(res)
}, (e) =>{
  console.log("Unable to save", e);
})

newUser.save().then((res)=>{
  console.log(res)
}, (e) => {
  console.log("Unable to save user", e)
})
