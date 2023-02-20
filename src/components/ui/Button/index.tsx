import React, { ReactNode } from 'react'
import styles from './index.module.scss'

type ButtonProps = {
    children: ReactNode
} & React.ComponentPropsWithoutRef<'button'>


const Button = ({ children, ...rest }: ButtonProps) => {
    return (
        <button {...rest} className={styles.button}>
            {children}
        </button>
    )
}

export default Button