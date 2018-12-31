const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../models/todos');


const id = "5c211bc404148b4f37fd3a86"


// Todo.remove
// Todo.remove({}).then((result) => {
//
// })


// Todo.findOneAndRemove()
Todo.findOneAndRemove({_id: '5c24391f36b12f571fe38e38'}).then((result) => {
  console.log(result)
})



// Todo.findByIdAndRemove()
Todo.findByIdAndRemove('5c24391f36b12f571fe38e38').then((result) => {
  console.log(result)
})
