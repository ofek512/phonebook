import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'

const PersonForm = (props) => {
  return (
    <form onSubmit={props.addName}>

      <div>name: <input value={props.newName} onChange={props.handleNoteChange} /></div>

      <div>number: <input value={props.newNumber} onChange={props.handleNumberChange} /></div>

      <div><button type="submit">add</button></div>

    </form>
  )
}

const DeleteButton = (props) => {
  // window confirm, "Delete [name] ?"
  return (
    <button onClick={() => {
      if (window.confirm(`Delete ${props.name} ?`)) {
        props.onDelete(props.id)
      }
    }}>delete</button>
  )
}

const Persons = (props) => {
  return (
    <ul>
      {props.persons.map(person => (
        <li key={person.name}>
          {person.name} {person.number} 
          <DeleteButton 
            name={person.name} 
            onDelete={props.handleDelete} 
            id={person.id} 
          />
        </li>
      ))}
    </ul>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])

  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
        console.log('you have added', initialPersons.length, 'names')
      })
  }, [])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }
  
  const handleDelete = (id) => {
    personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
        console.log('you have deleted', id)
      })
      .catch(error => {
        alert(`the person does not exist on the server`)
        setPersons(persons.filter(person => person.id !== id))
      })
  }

  const addName = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)

    //check if name already exists
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      setNewName('')
      return
    }

    //check if number already exists
    if (persons.some(person => person.number === newNumber)) {
      alert(`${newNumber} is already added to phonebook`)
      setNewNumber('')
      return
    }

    if  (newNumber === '') {
      alert(`Number cannot be empty`)
      return
    }

    const nameObject = {
      name: newName,
      number: newNumber
    }

    personService
      .create(nameObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        console.log('you have added', returnedPerson.name)
      })
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <PersonForm addName={addName} newName={newName} handleNoteChange={handleNoteChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons persons={persons} handleDelete={handleDelete} />
    </div>
  )
}

export default App