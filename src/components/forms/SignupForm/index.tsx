import React from 'react'
import Form from '@forms/Form'
import useForm from '@hooks/useForm'
import Input from '@ui/Input/Input'
import styles from './index.module.scss'
import { useUserStore } from '@data/user'
import { fetchSignup } from '@api/methods'
import { setToken } from '@api/localStorage'

const inputNames: Form.InputNames<Form.SignupForm> = {
    email: 'email',
    password: 'password',
}

const init: Form.SignupForm = {
    email: '',
    password: '',
}

const SignupForm = () => {
    const { setUser } = useUserStore()

    const signUpHandler = async (payload: Form.SignupForm) => {
        const response = await fetchSignup(payload)
        setToken(response.result.token)
        setUser({ data: response.result })
    }

    const {
        errors,
        formData,
        validateField,
        onChange,
        onSubmit,
        showErrors,
        success,
    } = useForm<Form.SignupForm>('signup', signUpHandler, init)
    return (
        <Form
            errors={errors}
            heading="Sign up"
            onSubmit={onSubmit}
            showErrors={showErrors}
            success={success}
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
                aria-label="email-input"
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
                aria-label="email-password"
            />
        </Form>
    )
}

export default SignupForm
