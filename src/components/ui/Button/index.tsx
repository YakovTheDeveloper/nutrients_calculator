import React, { ReactNode } from 'react'
import styles from './index.module.scss'
import classnames from 'classnames'

type ButtonProps = {
    children: ReactNode
    size?: 'medium' | 'big' | 'small'
    bordered?: boolean
    hovered?: boolean
    className?: string
} & React.ComponentPropsWithoutRef<'button'>

const Button = ({
    children,
    size = 'medium',
    bordered,
    hovered = true,
    className,
    ...rest
}: ButtonProps) => {
    return (
        <button
            {...rest}
            className={classnames([
                className,
                styles.button,
                styles[size],
                bordered && styles['bordered'],
                hovered && styles['hovered'],
            ])}
        >
            {children}
        </button>
    )
}

export default Button
