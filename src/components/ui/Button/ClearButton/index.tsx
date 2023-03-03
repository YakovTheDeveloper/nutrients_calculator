import React from 'react'
import Button from '..'
import styles from './index.module.scss'
import classnames from 'classnames'

type ClearButtonProps = {
    show: boolean
    className: string
    onClick: () => void
}

const ClearButton = ({ show, className, onClick }: ClearButtonProps) => {
    return show ? (
        <Button
            size="small"
            onClick={onClick}
            className={className}
            type="button"
        >
            x
        </Button>
    ) : null
}

export default ClearButton
