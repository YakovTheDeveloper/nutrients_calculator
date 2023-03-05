import Button from '@ui/Button'
import classNames from 'classnames'
import React, { useState } from 'react'
import styles from './Input.module.scss'

type InputProps = {
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    label?: string
    size: 'medium' | 'big' | 'small'
    name?: string
    type: string
    required?: boolean
    onBlur?: (e: React.FocusEvent<HTMLInputElement, Element>) => void
    placeholder?: string
    className?: string
    disabled?: boolean
    min?: string
    children?: React.ReactNode
    onKeyDown: React.KeyboardEventHandler<HTMLInputElement>
    skeletonPreloader: boolean
    pattern: string
    title: string
}

const Input = ({
    value,
    onChange,
    label,
    size,
    name,
    type,
    required,
    onBlur,
    placeholder,
    className,
    disabled,
    children,
    onKeyDown,
    skeletonPreloader,
    pattern,
    title,
}: InputProps) => {
    return (
        <div className={styles[skeletonPreloader]}>
            <label className={styles.container}>
                {label ? <p className={styles.label}>{label}</p> : null}
                <input
                    value={value}
                    onChange={onChange}
                    className={classNames(styles[size], className)}
                    name={name}
                    type={type}
                    onBlur={onBlur}
                    required={required}
                    placeholder={placeholder}
                    onKeyDown={onKeyDown}
                    disabled={disabled}
                    pattern={pattern}
                    title={title}
                />
                {children}
            </label>
        </div>
    )
}

export default Input
