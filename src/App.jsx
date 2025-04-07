import { useState, useEffect, useRef} from 'react'
import Filter from './Components/Filter'
import People from './Components/Persons'
import PeopleForm from './Components/PersonForm'
import LoginForm from './Components/LoginForm'
import phoneServices from './services/phone'
import loginService from './services/login'
import Togglable from './Components/Togglable'


const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newFilter, setFilter] = useState('')
  const [errorMessage, setError] = useState(null)
  const [trueErrorMessage, setTrueError] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)
  
  const phoneFormRef = useRef()

  const retrievePeople = () => {
    if (user){
      phoneServices.getAll().then(data=> {
        setPersons(data)
      })
    }
      
  }
  
  //window.localStorage.removeItem('loggedPhoneappUser')
  //window.localStorage.clear()
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedPhoneappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      phoneServices.setToken(user.token)
    }
  }, [])
  useEffect(retrievePeople,[user])
  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedPhoneappUser', JSON.stringify(user)
      )
      phoneServices.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setTrueError('Wrong credentials')
      setTimeout(() => {
        setTrueError(null)
      }, 5000)
    }
  }

  const AddPhone = (phoneObject) => {
      phoneFormRef.current.toggleVisibility()
      const {name, number} = phoneObject
      const foundPerson = persons.find(person => person.name === name)
      
      if (foundPerson){
        if (window.confirm(`${name} is already added to the phone book, replace the old number with the new one?`)){
          phoneServices.updatePerson({...foundPerson, number:number},foundPerson.id).then(data => {
            setPersons(persons.map(person => person.id === data.id ? data : person))
            setError(`${data.name} was updated with a new phone number of ${data.number}`)
            setTimeout(() => {setError(null)},5000)}
          ).catch(error => {setTrueError(error.response.data.error)
          setTimeout(() => {setTrueError(null)},5000)
          console.log(error)
          if (error.status === 404){
            setPersons(persons.filter(person => person.id != foundPerson.id))}
          })
        }
        else{
          return false
        }
        return true
      }
      const newPerson = {name : name, number : number }
      phoneServices.create(newPerson).then(data => {
        newPerson.id = data.id 
        setPersons(persons.concat(newPerson))
        setError(`${data.name} was Added, yay new friend`)
        setTimeout(() => {setError(null)},5000)
      }).catch(error =>{ 
        setTrueError(error.response.data.error)
        setTimeout(() => {setTrueError(null)},5000)
      }
      
    )
    return true  
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

  const logout = (event) => {
    window.localStorage.removeItem('loggedPhoneappUser')
    setUser(null)
  }
  
  const filteredPeople = persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))
  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }
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

      {user === null ?
        loginForm()
      :
      (<>
      <h2>Phonebook</h2>
      <h4>{user.name} logged-in</h4>
      <button onClick={logout}>logout </button>
      <Filter newFilter={newFilter} handleFilterChange={(event) => setFilter(event.target.value)}/>

      <h2>Add a new</h2>
      <Togglable buttonLabel="new note" ref={phoneFormRef}>
        <PeopleForm createPhone={AddPhone}/>
      </Togglable>
      <h2>Numbers</h2>

      <People filteredPeople = {filteredPeople} deletePerson = {deletePerson} />
      </>)}
    </div>
    )
}
export default App