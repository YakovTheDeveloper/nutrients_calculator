import React from 'react'
import { NavLink } from 'react-router-dom'
import styles from './index.module.scss'

const Nav = () => {
    return (
        <nav className={styles.nav}>
            <NavLink to="/" className={styles.link}>
                Search
            </NavLink>
            <NavLink to="menu" className={styles.link}>
                Menu
            </NavLink>
        </nav>
    )
}

export default Nav
