import classNames from 'classnames'
import React, { ReactNode } from 'react'
import styles from './index.module.scss'

type StatusMessageProps = {
    children: ReactNode
    type: 'success' | 'error' | 'idle'
    label?: string
}

const StatusMessage = ({
    children,
    type,
    label = 'status-message',
}: StatusMessageProps) => {
    return (
        <div
            className={classNames(styles.statusMessage, styles[type])}
            aria-label={label}
            aria-invalid={type === 'error' ? 'true' : 'false'}
            // data-testid="status-message"

            // aria-errormessage=''
        >
            {children}
        </div>
    )
}

export default StatusMessage
