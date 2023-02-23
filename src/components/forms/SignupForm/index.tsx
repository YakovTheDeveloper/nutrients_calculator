import React from 'react'
import { signup } from '@api'
import Form from '@forms/Form'
import useForm from '@hooks/useForm'

const inputNames: Form.InputNames<Form.SignupForm> = {
    email: 'email',
    password: 'password',
}

const SignupForm = () => {
    const {
        errors,
        formData,
        validateField,
        onChange,
        onSubmit,
        showErrors,
        success,
    } = useForm('signup', signup)
    return (
        <Form
            errors={errors}
            heading="Sign up"
            onSubmit={onSubmit}
            showErrors={showErrors}
            success={success}
        >
            <label>
                <p>Email</p>
                <input
                    name={inputNames.email}
                    type="email"
                    required
                    onChange={onChange}
                    onBlur={validateField}
                    value={formData['email']}
                    aria-label="email-input"
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
                    value={formData['password']}
                    aria-label="password-input"
                />
            </label>
        </Form>
    )
}

export default SignupForm
