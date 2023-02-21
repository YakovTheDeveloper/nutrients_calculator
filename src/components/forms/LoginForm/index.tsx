import React from 'react'
import { login } from '@api'
import Form from '@forms/Form'
import { useForm } from '@hooks/useForm'

const inputNames: Form.InputNames<Form.LoginForm> = {
    email: 'email',
    password: 'password',
}
const LoginForm = () => {
    const { errors, formData, validateField, showErrors, onChange, onSubmit } = useForm(
        'login',
        login
    )
    return (
        <Form errors={errors} heading="Login" onSubmit={onSubmit} showErrors={showErrors}>
            <label>
                <p>Email</p>
                <input
                    name={inputNames.email}
                    type="email"
                    required
                    onChange={onChange}
                    onBlur={validateField}
                    value={formData.email}
                />
            </label>
            <label>
                <p>Password</p>
                <input
                    name={inputNames.password}
                    type="password"
                    required
                    onChange={onChange}
                    onBlur={validateField}
                    value={formData.password || ''}
                />
            </label>
        </Form>
    )
}

export default LoginForm
