const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

app.use(cors());
app.use(express.json());

// Özelleştirilmiş Morgan formatı
morgan.token('body', (request, response) => JSON.stringify(request.body)); // request body'sini alır (istek gövdesini alır --> POST requestler için)

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

let persons = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.get('/', (request, response) => {
  response.send('<h1>Phonebook Project</h1>');
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
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

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

const generateId = () => String(parseInt(Math.random() * 800000));

app.post('/api/persons', (request, response) => {
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).json({
      error: 'The name or number is missing',
    });
  }

  const hasPerson = persons.some(
    (person) => person.name.toLowerCase() === name.toLocaleLowerCase()
  );

  if (hasPerson) {
    return response.status(409).json({
      error: 'The name already exists in the phonebook',
    });
  }

  const person = {
    name,
    number,
    id: generateId(),
  };

  persons = persons.concat(person);

  response.json(person);
});

app.delete('/api/persons/:id', (request, response) => {
  const { id } = request.params;
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
