import StatusMessage from '@ui/StatusMessage'
import React, { ReactNode } from 'react'
import styles from './index.module.scss'

type FormProps = {
    children: ReactNode
    errors: Record<string, string>
    heading: string
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    showErrors: boolean
    success: boolean
}

const Form = ({
    children,
    errors,
    onSubmit,
    heading,
    showErrors,
    success,
}: FormProps) => {
    const errorMessage = Object.values(errors).find(
        (errorMessage) => errorMessage !== ''
    )

    // const getStatusMessage = () => {
    //     if (success) return 'success'
    // }

    return (
        <div className={styles.loginWrapper}>
            <span className={styles.formTypeName}>{heading}</span>
            <form onSubmit={onSubmit}>
                {children}
                <div>
                    <button
                        type="submit"
                        className={styles.submitBtn}
                        aria-label="submit-button"
                    >
                        Submit
                    </button>
                </div>
                {/* {
                    <StatusMessage type={getStatusMessage()}>j
                        Success
                    </StatusMessage>
                } */}
                {success && (
                    <StatusMessage type="success">Success</StatusMessage>
                )}
                {showErrors && errorMessage && (
                    <StatusMessage type="error">{errorMessage}</StatusMessage>
                )}
            </form>
        </div>
    )
}

export default Form
