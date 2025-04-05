const Person = ({filteredPeople, deletePerson}) => {
    
    return (
        <>
            {filteredPeople.map((person)=> <div key = {person.id} >
                <span>{person.name} {person.number}</span>
                <button onClick={() => deletePerson(person.id,person.name)}>Delete person</button> </div>
           )}
        </>
    )
}

export default Person