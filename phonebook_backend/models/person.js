/* eslint-disable no-undef */
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

console.log('URL', url)
console.log('connecting to', url)

mongoose.connect( url, { useNewUrlParser: true, useUnifiedTopology: true })
  // eslint-disable-next-line no-unused-vars
  .then( result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema ({
  name : { type : String, minlength: 3, unique : true },
  number : { type : String, minlength : 8, unique : true }
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
  transform : ( document, returnedPerson) => {
    returnedPerson.id = returnedPerson._id.toString()
    delete returnedPerson._id
    delete returnedPerson.__v
  }
})

module.exports = mongoose.model('Person', personSchema)

