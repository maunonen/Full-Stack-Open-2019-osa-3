/* eslint-disable no-undef */
const mongoose = require('mongoose')

if ( process.argv.length < 5 ) {
  console.log('PLease provide password, name and phonenumber')
  process.exit(1)
} else {
  process.argv.forEach( param  => {
    console.log('param', param )
  })
}

// eslint-disable-next-line no-unused-vars
const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = process.env.MONGODB_URI

mongoose.connect( url , { useNewUrlParser: true, useUnifiedTopology: true  })
  .then( (result) => {
    if (result){
      console.log('Connection to Mongo Atlas success')
    }
  })
  .catch( error => {
    console.log('Error', error)
  })
const personSchema = new mongoose.Schema ({
  name : String,
  number : String
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name,
  number
})

person.save().then( responce => {
  if ( responce){
    console.log(`Added ${ name} number ${ number }  to phonebook`)
    Person.find({}).then( result => {
      console.log('Phonebook')
      result.forEach( person => {
        console.log(`${ person.name} ${ person.number }`)
      })
      mongoose.connection.close()
    })
  }
}).catch( error => {
  console.log( error )
})
