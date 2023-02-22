import React, { ReactNode } from 'react'
import styles from './index.module.scss'

type FormProps = {
    children: ReactNode
    errors: Record<string, string>
    heading: string
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    showErrors: boolean
}

const Form = ({ children, errors, onSubmit, heading, showErrors }: FormProps) => {
    const atLeastOneError = Object.values(errors).find(
        (errorMessage) => errorMessage !== ''
    )

    return (
        <div className={styles.loginWrapper}>
            <span className={styles.formTypeName}>{heading}</span>
            <form onSubmit={onSubmit}>
                {children}
                <div>
                    <button type="submit" className={styles.submitBtn}>
                        Submit
                    </button>
                </div>
                <div>{showErrors && atLeastOneError}</div>
            </form>
        </div>
    )
}

export default Form
