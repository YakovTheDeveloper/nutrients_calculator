import classNames from 'classnames'
import React from 'react'
import styles from './index.module.scss'

type LoaderProps = {
    className?: string
}

const Loader = ({ className }: LoaderProps) => {
    return <div className={classNames(styles.spinner, className)}></div>
}

export default Loader
