const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',
  { useNewUrlParser: true},
  (err, client) => {

    if(err){
      return console.log('Could not connect to mongodb');
    }
    console.log('Successfully connected to MongoDB server');

    const db = client.db('TodoApp')

    //delete one
    // db.collection('Todos').deleteOne({text: "Walk cat"}).then((result) => {
    //   console.log(result)
    // })
    //
    //delete many
    // db.collection('Todos').deleteMany({text: "Walk cat"}).then((result) => {
    //   console.log(result)
    // })

    //findOneAndDelete
    // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
    //   console.log(result);
    // })

    client.close();

})
