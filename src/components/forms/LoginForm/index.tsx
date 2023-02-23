import React from 'react'
import { login } from '@api'
import Form from '@forms/Form'
import useForm from '@hooks/useForm'
import Input from '@ui/Input/Input'
import styles from './index.module.scss'

const inputNames: Form.InputNames<Form.LoginForm> = {
    email: 'email',
    password: 'password',
}
const LoginForm = () => {
    const {
        errors,
        formData,
        validateField,
        showErrors,
        onChange,
        onSubmit,
        success,
    } = useForm('login', login)
    return (
        <Form
            errors={errors}
            heading="Login"
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
                value={formData.email}
                clear={() => {
                    return
                }}
                className={styles.loginInput}
            />
            <Input
                label="Password"
                name={inputNames.password}
                type="password"
                required
                onChange={onChange}
                onBlur={validateField}
                value={formData.password || ''}
                clear={() => {
                    return
                }}
                className={styles.loginInput}
            />
        </Form>
    )
}

export default LoginForm
