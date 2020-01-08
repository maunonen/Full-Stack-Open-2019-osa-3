require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const Person = require('./models/person')



app.use(bodyParser.json())
app.use(express.static('build'))
// eslint-disable-next-line no-undef
app.use('/', express.static(__dirname))

// create new token
// eslint-disable-next-line no-unused-vars
morgan.token('body',  ( req, res )  => JSON.stringify(req.body))
// modify tiny fromat string with new token
app.use(morgan(':method :url :status :res[content-length] - :response-time ms  :body' ))

// route for get all person (GET)
app.get('/api/persons', (req, res, next) => {
  Person.find({}).then( persons => {
    if ( persons) {
      return res.status(200).json(persons.map( person => {
        // eslint-disable-next-line no-console
        console.log('Person toJSON', person.toJSON())
        return person.toJSON()
      }))
    }
    res.status(404)
  })
    .catch( err => next(err))
})

app.get('/api/persons/:id', ( req, res, next) => {
  Person.findById( req.params.id)
    .then( person => {
      if ( person){
        res.json( person.toJSON())
      } else {
        res.status(404).end()
      }
    })
    .catch( err => next(err))
})

// route for add person (POST)
app.post('/api/persons', function (req, res, next) {
  const body  = req.body
  if ( body.name === undefined ||  body.number === undefined) {
    return  res.status(400).json({ error : 'Name or phonenumber missing' })
  }
  const person = new Person({
    name : body.name,
    number : body.number
  })

  person.save()
    .then( personToSave => personToSave.toJSON())
    .then( formatedPerson => {
      res.json(formatedPerson)
    })
    .catch( error => next(error))
})


// route for update person (PUT)
app.put('/api/persons/:id', function (req, res, next) {
  const body = req.body
  const person = {}

  if ( body.number !== undefined){
    person.number = body.number
  }
  Person.findByIdAndUpdate( req.params.id, person, { new : true })
    .then( personToUpdate => {
      res.json(personToUpdate.toJSON())
    })
    .catch( error => {
      // eslint-disable-next-line no-console
      console.log(error)
      next(error)
    })
})

// route for delete person (DELET)
app.delete('/api/persons/:id', function (req, res, next) {
  Person.findByIdAndRemove( req.params.id)
    .then( result => {
      //console.log('Result', result)
      if (result){
        return res.status(204).end()
      }
      res.status(404).send({  error : 'Person not found or has been removed' })
    })
    .catch( error => next(error))
})

/* const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  // handler of requests with unknown endpoint
  app.use(unknownEndpoint) */

const errorHandler = (error, req, res, next ) => {
  console.log(error)
  if( error.name === 'CastError' && error.kind === 'ObjectId'){
    return res.status(400).send({ error : 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
