import React from 'react'
import { signup } from '@api'
import Form from '@forms/Form'
import { useForm } from '@hooks/useForm'
import Input from '@ui/Input/Input'
import styles from './index.module.scss'

const inputNames: Form.InputNames<Form.SignupForm> = {
    email: 'email',
    password: 'password',
}

const SignupForm = () => {
    const { errors, formData, validateField, onChange, onSubmit, showErrors } = useForm(
        'signup',
        signup
    )
    return (
        <Form
            errors={errors}
            heading="Sign up"
            onSubmit={onSubmit}
            showErrors={showErrors}
        >
            <Input
                label="Email"
                name={inputNames.email}
                type="email"
                required
                onChange={onChange}
                onBlur={validateField}
                value={formData['email']}
                clear={() => {
                    return
                }}
                className={styles.signupInput}
            />

            <Input
                label="Password"
                name={inputNames.password}
                type="password"
                required
                onChange={onChange}
                onBlur={validateField}
                value={formData['password']}
                clear={() => {
                    return
                }}
                className={styles.signupInput}
            />
        </Form>
    )
}

export default SignupForm
