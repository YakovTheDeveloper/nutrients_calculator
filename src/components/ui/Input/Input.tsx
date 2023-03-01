import Button from '@ui/Button'
import React, { useState } from 'react'
import styles from './Input.module.scss'

type InputProps = {
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    label?: string
    clear?: () => void
    size: 'medium' | 'big' | 'small'
    name?: string
    type: string
    required?: boolean
    onBlur?: (e: React.FocusEvent<HTMLInputElement, Element>) => void
    placeholder?: string
    disabled?: any
    min?: string
    // className: string
}

const Input = ({
    value,
    onChange,
    label,
    clear,
    size,
    name,
    type,
    required,
    onBlur,
    placeholder,
    disabled,
    showClearButton,
}: InputProps) => {
    return (
        <label className={styles.container}>
            {label ? <p className={styles.label}>{label}</p> : null}
            <input
                value={value}
                onChange={onChange}
                className={styles[size]}
                name={name}
                type={type}
                onBlur={onBlur}
                required={required}
                placeholder={placeholder}
            />
            {showClearButton ? (
                <Button
                    size="small"
                    onClick={clear}
                    className={styles.clearBtn}
                    type="button"
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
