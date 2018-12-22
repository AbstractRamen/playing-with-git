const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',
  { useNewUrlParser: true},
  (err, client) => {

    if(err){
      return console.log('Could not connect to mongodb');
    }
    console.log('Successfully connected to MongoDB server');

    const db = client.db('TodoApp')



    client.close();

})
