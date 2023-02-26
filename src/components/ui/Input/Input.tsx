import Button from '@ui/Button'
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
            {label ? <p className={styles.label}>{label}</p> : null}
            <input value={value} onChange={onChange} {...rest} />
            {value ? (
                <Button
                    size="small"
                    onClick={clear}
                    className={styles.clearBtn}
                >
                    x
                </Button>
            ) : (
                ''
            )}
        </label>
    )
}

export default Input
