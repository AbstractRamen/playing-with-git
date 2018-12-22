const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',
  { useNewUrlParser: true },
  (err, client) => {
    if(err){
      return console.log('Unable to connect to MongoDB server')
    }
    console.log('Successfully connected to MongoDB server')

    const db = client.db('TodoApp')

    // Find query
    // db.collection('Todos').find({completed: false}).toArray().then((docs) => {
    //   console.log('Todos');
    //   console.log(JSON.stringify(docs, undefined, 2))
    //   if (err){
    //     console.log('Unable to fetch to-dos');
    //   }
    // })

    // db.collection('Todos').find({completed: false}).count().then((count) => {
    //   console.log('Number of to-dos: ' + count);
    //   if (err){
    //     console.log('Unable to fetch to-dos');
    //   }
    // })

    db.collection('Users').find({_id: new ObjectID('5c1d3d8ff78e11429eb6e38c')}).count().then((count) => {
      console.log('Number of to-dos: ' + count);
      if (err){
        console.log('Unable to fetch to-dos');
      }
    })

    client.close();

});
