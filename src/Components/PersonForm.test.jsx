import { render, screen } from '@testing-library/react'
import PersonForm from './PersonForm'
import userEvent from '@testing-library/user-event'

test('<PersonForm /> updates parent state and calls onSubmit', async () => {
  const createPhone = vi.fn()
  const user = userEvent.setup()

  render(<PersonForm createPhone={createPhone} />)

  const textboxes = screen.getAllByRole('textbox')
  const nameInput = textboxes[0]
  const numberInput = textboxes[1]
  const sendButton = screen.getByText('add')

  await user.type(nameInput, 'Bobby')
  await user.type(numberInput, '432-4324324')
  await user.click(sendButton)

  expect(createPhone.mock.calls).toHaveLength(1)
  expect(createPhone.mock.calls[0][0].name).toBe('Bobby')
  expect(createPhone.mock.calls[0][0].number).toBe('432-4324324')
  //[ [ { name: 'Bobby', number: '432-4324324' } ] ]
})