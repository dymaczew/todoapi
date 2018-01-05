const MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB');
  }
  console.log('Connection to MongoDB established');

  db.collection('Todos').insertOne({
    text: 'Wypic piwo',
    done: true 
    }, (err, result) => {
    if (err) {
      return console.log('Unable to connect to MongoDB', err);
    }
    console.log(JSON.stringify(result.ops, undefined, 2));
  });

  db.collection('Users').insertOne({
    name: 'Tomek Dymaczewski',
    age: 7,
    location: 'Sportowa 2b, Suchy Las' 
    }, (err, result) => {
    if (err) {
      return console.log('Unable to connect to MongoDB', err);
    }
    console.log(JSON.stringify(result.ops, undefined, 2));
  });

  db.close();
});

