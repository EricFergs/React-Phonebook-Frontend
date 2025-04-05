const Filter = ({newFilter,handleFilterChange}) => {
    return(<form >
            filter shown with<input value = {newFilter} onChange={handleFilterChange}/>
            </form>)
}

export default Filter