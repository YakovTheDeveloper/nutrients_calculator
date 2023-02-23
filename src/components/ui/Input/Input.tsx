import React, { useState } from 'react'
import styles from './Input.module.scss'

type InputProps = {
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    label?: string
    clear: () => void
} & React.ComponentPropsWithoutRef<'input'>

const Input = ({ value, onChange, label, clear, ...rest }: InputProps) => {
    return (
        <label className={styles.container}>
            {label ? <p>{label}</p> : null}
            <input value={value} onChange={onChange} {...rest} />
            {value ? (
                <button className={styles.clearBtn} onClick={clear}>
                    X
                </button>
            ) : (
                ''
            )}
        </label>
    )
}

export default Input
