require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

app.use(express.static('dist'));
app.use(cors());
app.use(express.json());

// Özelleştirilmiş Morgan formatı
morgan.token('body', (request, response) => JSON.stringify(request.body)); // request body'sini alır (istek gövdesini alır --> POST requestler için)

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

let persons = [];

app.get('/', (request, response) => {
  response.send('<h1>Phonebook Project</h1>');
});

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get('/info', (request, response) => {
  const getPersonsCount = persons.length;
  const date = new Date();

  response.send(
    `<p>phonebook has info for ${
      getPersonsCount > 1
        ? `${getPersonsCount} people`
        : `${getPersonsCount} person`
    } <br /><br /> ${date}</p>`
  );
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.post('/api/persons', (request, response) => {
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).json({
      error: 'The name or number is missing',
    });
  }

  const person = new Person({
    name,
    number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

// For Unknown Endpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({
    error: 'unknown endpoint',
  });
};

app.use(unknownEndpoint);

// For Error Handler
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({
      error: 'malformatted id',
    });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
