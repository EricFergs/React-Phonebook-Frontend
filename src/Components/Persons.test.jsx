import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import People from './Persons'

test('renders content', () => {
    const person = [{
        id : 1,
        name: 'Component testing is done with react-testing-library',
        number: "534-4324234"
        },
        {
            id : 2,
            name: 'Vitest and Jest are both testing frameworks',
            number: "534-432432432"
        }]
    const mockDeletePerson = vi.fn();
    const { container } = render(<People filteredPeople={person}  deletePerson={mockDeletePerson} />)

    const div = container.querySelector('.person')
    screen.debug(div)
    expect(div).toHaveTextContent(
        /Component testing is done with react-testing-library/
    )
   
})

test('clicking the button calls event handler once', async () => {
    const person = [{
        id : 1,
        name: 'Component testing is done with react-testing-library',
        number: "534-4324234"
        },
        {
            id : 2,
            name: 'Vitest and Jest are both testing frameworks',
            number: "534-432432432"
        }]
    const mockDeletePerson = vi.fn();
    render(<People filteredPeople={person}  deletePerson={mockDeletePerson} />)

    const user = userEvent.setup()
    const button = screen.getAllByText('Delete person')
    await user.click(button[0])

    expect(mockDeletePerson.mock.calls).toHaveLength(1)
})