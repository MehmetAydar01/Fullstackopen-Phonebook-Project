const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://phonebookapp:${password}@cluster0.ul8jf.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

// Creating new person in the database...

// const newPerson = new Person({
//   name: process.argv[3] || 'Mehmet',
//   number: process.argv[4] || '048-1212678',
// });

// newPerson.save().then((result) => {
//   console.log(`added ${result.name} number ${result.number} to phonebook`);
//   mongoose.connection.close();
// });

// Fetching person objects from the database...

Person.find({}).then((result) => {
  console.log('phonebook:');

  result.forEach((person) => {
    console.log(person.name, person.number);
  });

  mongoose.connection.close();
});
