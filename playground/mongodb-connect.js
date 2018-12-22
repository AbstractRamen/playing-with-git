const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp',
  { useNewUrlParser: true },
  (err, client) => {
  if(err){
    return console.log('Unable to connect to MongoDB server')
  }
  console.log('Successfully connected to MongoDB server')

  const db = client.db('TodoApp')

  // db.collection('Todos').insertOne({
  //   text: 'Buy food',
  //   completed: false
  // }, (err, result)=>{
  //   if (err){
  //     return console.log('Unable to insert to-do', err);
  //   }
  //
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // })

  db.collection('Users').insertOne({
    name: 'Jasp',
    age: 25,
    location: 'NY'
  }, (err, result)=>{
    if (err){
      return console.log('Unable to create user', err);
    }

    console.log(JSON.stringify(result.ops, undefined, 2));
    console.log(result.ops);
    console.log(result.ops[0]._id.getTimestamp())
  })

  client.close();

});
