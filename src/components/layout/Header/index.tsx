import React from 'react'
import Nav from './Nav'
import styles from './index.module.scss'
import { shallow } from 'zustand/shallow'
import { useUserStore } from '@data/user'
import Button from '@ui/Button'

const Header = () => {
    const { user, setUser, setMenus, clearStore } = useUserStore(
        (state) => ({
            user: state.user,
            setUser: state.setUser,
            setMenus: state.setMenus,
            clearStore: state.clearStore,
        }),
        shallow
    )

    const logoutHandler = () => {
        clearStore()
    }

    return (
        <header className={styles.header}>
            <Nav />
            <section>
                {user && (
                    <>
                        <span>Logged in as: {user.data.email}</span>
                        <br />
                        <br />
                        <Button onClick={logoutHandler}>Logout</Button>
                    </>
                )}
            </section>
        </header>
    )
}

export default Header
