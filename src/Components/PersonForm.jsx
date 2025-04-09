import { useState } from 'react'

const PersonForm = ({ createPhone }) => {
  const [newName, setNewName] = useState('')  //controller for input element
  const [newPhone, setNewPhone] = useState('')

  const addPhone = (event) => {
    event.preventDefault()
    const doesChange = createPhone({
      name: newName,
      number: newPhone
    })

    if(doesChange){
      setNewName('')
      setNewPhone('')
    }  
  }
  return(
      <form onSubmit = {addPhone} className="formBlock">
      <div>
        name: <input value = {newName} onChange={event => setNewName(event.target.value)}/>
      </div>
      <div>
        number: <input value = {newPhone} onChange={({target}) => setNewPhone(target.value)}/> 
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

export default PersonForm