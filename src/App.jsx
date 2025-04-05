import { useState, useEffect} from 'react'
import Filter from './Components/Filter'
import People from './Components/Persons'
import PeopleForm from './Components/PersonForm'
import phoneServices from './services/phone'


const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')  //controller for input element
  const [newPhone, setNewPhone] = useState('')
  const [newFilter, setFilter] = useState('')
  const [errorMessage, setError] = useState(null)
  const [trueErrorMessage, setTrueError] = useState(null)


  const retrievePeople = () => {
      phoneServices.getAll().then(data=> {
        setPersons(data)
      })
  }

  useEffect(retrievePeople,[])

  const AddPhone = (event) => {
      event.preventDefault()

      const foundPerson = persons.find(person => person.name === newName)
      
      if (foundPerson){
        if (window.confirm(`${newName} is already added to the phone book, replace the old number with the new one?`)){
          phoneServices.updatePerson({...foundPerson, number:newPhone},foundPerson.id).then(data => {
            setPersons(persons.map(person => person.id === data.id ? data : person))
            setNewName('')
            setNewPhone('')
            setError(`${data.name} was updated with a new phone number of ${data.number}`)
            setTimeout(() => {setError(null)},5000)}
          ).catch(error => {setTrueError(error.response.data.error)
          setTimeout(() => {setTrueError(null)},5000)
          console.log(error)
          if (error.status === 404){
            setPersons(persons.filter(person => person.id != foundPerson.id))}
          })
        }
        return
      }
      const newPerson = {name : newName, number : newPhone }
      phoneServices.create(newPerson).then(data => {
        newPerson.id = data.id 
        setPersons(persons.concat(newPerson))
        setNewName('')
        setNewPhone('')
        setError(`${data.name} was Added, yay new friend`)
        setTimeout(() => {setError(null)},5000)
      }).catch(error =>{ 
        setTrueError(error.response.data.error)
        setTimeout(() => {setTrueError(null)},5000)
      }
    )
      
      
  }
  const deletePerson = (id, name) => {
    
    if (!window.confirm(`Do you wish to delete ${name}?`)){
      return 
    }
    phoneServices.deletePerson(id).then(data => {
        const newPeopleList = persons.filter(person => person.id != id)
        setPersons(newPeopleList)
    })
  }

  const handleNameChange = (event) => {
      setNewName(event.target.value)
  }

  const handlePhoneChange = (event) => {
    setNewPhone(event.target.value)
  }
  
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const changeErrorMessage = (message) => {
    setError(message)
  }
  
  
  
  const filteredPeople = persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))
  //console.log(persons)
  return (
    <div>
      {errorMessage && (
          <div className='error'>
          {errorMessage}
        </div>
      )}
      {trueErrorMessage && (
          <div className='trueError'>
          {trueErrorMessage}
        </div>
      )}

    
      
      <h2>Phonebook</h2>

      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange}/>

      <h2>Add a new</h2>

      <PeopleForm AddPhone ={AddPhone} handleNameChange ={handleNameChange} handlePhoneChange = {handlePhoneChange}  newName={newName} 
  newPhone={newPhone}/>

      <h2>Numbers</h2>

      <People filteredPeople = {filteredPeople} deletePerson = {deletePerson} />

    </div>
  )
}

export default App