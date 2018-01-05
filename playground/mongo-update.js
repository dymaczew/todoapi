const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB');
  }
  console.log('Connection to MongoDB established');

  db.collection('Todos').findOneAndUpdate({ 
      _id: new ObjectID('5970f4a74cf85c06f949ea86')
     },{
      $inc: {
        overdue: -2
      },
      $set: {
        completed: false
      }
     },{
      returnOriginal: false
     }
    ).then( (result) => {
    console.log(result);
  });


  //db.close();
});

