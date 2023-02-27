import classNames from 'classnames'
import React from 'react'
import styles from './index.module.scss'

type IndicatorProps = {
    percent: number
}

const HIGHER_PERCENT_BORDER = 90

const PADDING_OFFSET = '10px'

const Indicator = ({ percent }: IndicatorProps) => {
    // const colorClass =
    return (
        <span
            className={classNames(
                styles.container,
                percent >= HIGHER_PERCENT_BORDER ? styles.success : styles.ok
            )}
            style={{
                width: (percent > 100 ? 100 : percent) + '%',
            }}
        ></span>
    )
}

export default Indicator
