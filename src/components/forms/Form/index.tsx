import React, { ReactNode } from 'react'

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
        <div className="login-wrapper">
            <br />
            <br />
            <h1>{heading}</h1>
            <form onSubmit={onSubmit}>
                {children}
                <div>
                    <button type="submit">Submit</button>
                </div>
                <div>{showErrors && atLeastOneError}</div>
            </form>
            <br />
            <br />
        </div>
    )
}

export default Form
