import React from 'react'
import { NavLink } from 'react-router-dom'
import styles from './index.module.scss'

const Nav = () => {
    return (
        <nav className={styles.nav}>
            <NavLink to="/">Main</NavLink>
            <NavLink to="menu">Menu</NavLink>
        </nav>
    )
}

export default Nav
