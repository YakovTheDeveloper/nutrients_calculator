import React from 'react'
import Form from '@forms/Form'
import useForm from '@hooks/useForm'
import Input from '@ui/Input/Input'
import styles from './index.module.scss'
import { useUserStore } from '@data/user'
import { fetchLogin } from '@api/methods'
import { setToken } from '@api/localStorage'

const inputNames: Form.InputNames<Form.LoginForm> = {
    email: 'email',
    password: 'password',
}

const init: Form.LoginForm = {
    email: '',
    password: '',
}

const LoginForm = () => {
    const { setUser } = useUserStore()

    const loginHandler = async (payload: Form.LoginForm) => {
        const response = await fetchLogin(payload)
        setToken(response.result.token)
        setUser({ data: response.result })
    }

    const {
        errors,
        formData,
        validateField,
        showErrors,
        onChange,
        onSubmit,
        success,
        setFormData,
    } = useForm<Form.LoginForm>('login', loginHandler, init)

    return (
        <Form
            errors={errors}
            heading="Log in"
            onSubmit={onSubmit}
            showErrors={showErrors}
            success={success}
            className={styles.loginInput}
        >
            <Input
                label="Email"
                name={inputNames.email}
                type="email"
                required
                onChange={onChange}
                onBlur={validateField}
                value={formData.email}
                size="medium"
                clear={() => {
                    setFormData((prev) => ({ ...prev, email: '' }))
                }}
            />
            <Input
                label="Password"
                name={inputNames.password}
                type="password"
                required
                onChange={onChange}
                onBlur={validateField}
                value={formData.password || ''}
                size="medium"
                clear={() => {
                    setFormData((prev) => ({ ...prev, password: '' }))
                }}
            />
        </Form>
    )
}

export default LoginForm
