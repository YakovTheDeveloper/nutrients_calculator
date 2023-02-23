import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import SignupForm from '@forms/SignupForm'

test('should appear error message component', () => {
    const { getByLabelText } = render(<SignupForm />)
    const emailInput = getByLabelText('email-input') as HTMLInputElement
    const passwordInput = getByLabelText('password-input') as HTMLInputElement

    fireEvent.change(emailInput, { target: { value: 'example@test.com' } })
    fireEvent.blur(emailInput)
    fireEvent.change(passwordInput, { target: { value: '1234' } })
    fireEvent.blur(passwordInput)

    const statusMessageElement = getByLabelText('status-message')
    expect(statusMessageElement).toBeInTheDocument()
    expect(statusMessageElement).toHaveAttribute('aria-invalid', 'true')
    expect(statusMessageElement).toHaveTextContent(/must be/)
})

test('should NOT appear error message component', () => {
    const { getByLabelText, queryByLabelText } = render(<SignupForm />)
    const emailInput = getByLabelText('email-input') as HTMLInputElement
    const passwordInput = getByLabelText('password-input') as HTMLInputElement
    fireEvent.change(emailInput, { target: { value: 'example@test.com' } })
    fireEvent.blur(emailInput)
    fireEvent.change(passwordInput, { target: { value: '123456' } })
    fireEvent.blur(passwordInput)

    const statusMessageElement = queryByLabelText('status-message')
    expect(statusMessageElement).toBeNull()
})
