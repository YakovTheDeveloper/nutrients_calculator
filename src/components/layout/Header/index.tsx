import React from 'react'
import Nav from './Nav'
import styles from './index.module.scss'
import { shallow } from 'zustand/shallow'
import { useUserStore } from '@data/user'
import Button from '@ui/Button'
import { useModalStore } from '@data/modal'
import SignupForm from '@forms/SignupForm'
import LoginForm from '@forms/LoginForm'

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
    const { isOpened, closeModal, modalContent, openModal } = useModalStore()

    const logoutHandler = () => {
        clearStore()
    }

    return (
        <header className={styles.header}>
            <Nav />
            <section>
                {user && (
                    <div className={styles.headerSection}>
                        <span>Logged in as: {user.data.email}</span>

                        <Button
                            onClick={logoutHandler}
                            className={styles.logOutBtn}
                            size="small"
                        >
                            Logout
                        </Button>
                    </div>
                )}
            </section>
            {user ? null : (
                <div>
                    <Button
                        onClick={() =>
                            openModal(
                                <>
                                    <button
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            padding: '10px',
                                            cursor: 'pointer',
                                        }}
                                        onClick={closeModal}
                                    >
                                        x
                                    </button>
                                    <SignupForm />
                                </>
                            )
                        }
                        bordered
                        size="medium"
                    >
                        Sign Up
                    </Button>

                    <Button
                        onClick={() =>
                            openModal(
                                <>
                                    <button
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            padding: '10px',
                                            cursor: 'pointer',
                                        }}
                                        onClick={closeModal}
                                    >
                                        x
                                    </button>
                                    <LoginForm />
                                </>
                            )
                        }
                        bordered
                        size="medium"
                    >
                        Log in
                    </Button>
                </div>
            )}
        </header>
    )
}

export default Header
