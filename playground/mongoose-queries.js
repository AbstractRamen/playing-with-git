const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../models/todos');


const id = "5c211bc404148b4f37fd3a86"

if(!ObjectID.isValid(id)){
  console.log('Not valid');
}

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos:', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo: ', todo);
// });

Todo.findById(id).then((todo) => {
  if (!todo){
    return console.log('No such todo');
  }
  console.log('Todo: ', todo)
}).catch((e) => {
  console.log('Heres the error: ', e)
});
