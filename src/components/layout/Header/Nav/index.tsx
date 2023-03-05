import classNames from 'classnames'
import React from 'react'
import { NavLink } from 'react-router-dom'
import styles from './index.module.scss'

const LINKS = [
    { to: '/', content: 'search' },
    { to: 'menu', content: 'menu' },
    { to: 'productsTier', content: 'products tier' },
]

const Nav = () => {
    return (
        <nav className={styles.nav}>
            {LINKS.map((link) => (
                <NavLink
                    to={link.to}
                    key={link.to}
                    className={({ isActive }) =>
                        isActive
                            ? classNames(styles.link, styles.active)
                            : classNames(styles.link)
                    }
                >
                    {link.content}
                </NavLink>
            ))}
        </nav>
    )
}

export default Nav
