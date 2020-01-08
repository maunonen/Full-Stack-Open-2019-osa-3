require('dotenv').config()

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const Note  = require('./models/note')

app.use(express.static('build'))
app.use(cors()) 
app.use(bodyParser.json())

  app.get('/api/notes/:id', (request, response, next) => {
    Note.findById(request.params.id)
      .then(note => {
        if (note) {
          response.json(note.toJSON())
        } else {
          response.status(404).end() 
        }
      })
      .catch(error => next(error))
  })

  app.delete('/api/notes/:id', (request, response, next) => {
    Note.findByIdAndRemove(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
  })

  const generateId = () => {
    const maxId = notes.length > 0
      ? Math.max(...notes.map(n => n.id))
      : 0
    return maxId + 1
  }
  
  app.post('/api/notes', (request, response, next) => {
    const body = request.body
    // checking request body 
    if (body.content === undefined) {
      return response.status(400).json({ error: 'content missing' })
    }
    // verifying that 
  
    const note = new Note({
      content: body.content,
      important: body.important || false,
      date: new Date(),
    })
  
    note.save()
      .then(savedNote => savedNote.toJSON())
      .then(savedAndFormattedNote => {
        response.json(savedAndFormattedNote)
      }) 
      .catch( error => next(error))
  })


  app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
      console.log('All notes', notes)
      response.json(notes.map(note => note.toJSON()))
    });
  });


  app.put('/api/notes/:id', (request, response, next) => {
    const body = request.body
    const note = {}

    if ( body.content !== undefined){
        note.content = body.content
    }
    if ( body.important !== undefined){
        note.important = body.important
    }
    
    Note.findByIdAndUpdate(request.params.id, note, { new: true })
      .then(updatedNote => {
        response.json(updatedNote.toJSON())
      })
      .catch(error => next(error))
  })  

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  // handler of requests with unknown endpoint
  app.use(unknownEndpoint)

  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    }
    next(error)
  }
  
  app.use(errorHandler)

  const PORT = process.env.PORT || 3001
  app.listen(PORT, ()=> {
      console.log(`Server running on port ${PORT}`)
  })
