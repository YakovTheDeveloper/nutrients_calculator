import React, { useEffect } from 'react'
import './styles/index.scss'
import SearchAndCalculate from '@pages/searchAndCalculate'
import LoginForm from '@forms/LoginForm'
import Modal from '@common/Modal'
import { useModalStore } from '@data/modal'
import SignupForm from '@forms/SignupForm'
import { getToken, getMe } from '@api'
import { useUser } from '@data/user'
import Button from '@ui/Button'

export const App = () => {
    const { isOpened, closeModal, modalContent, openModal } = useModalStore()

    const { user, setUser, removeUser } = useUser()

    useEffect(() => {
        if (user) return
        if (!getToken()) return

        getMe().then((res) => {
            console.log('res', res)
            if (res.isError) return
            const userData = res.result
            console.log('res.result', res.result)
            console.log('userData', userData)
            setUser({
                data: {
                    email: userData.email,
                },
            })
        })
    }, [user])

    return (
        <div>
            <section>
                {user && (
                    <>
                        <span>Logged in as: {user.data.email}</span>
                        <br />
                        <br />
                        <Button onClick={() => removeUser()}>Logout</Button>
                    </>
                )}
            </section>
            <br />

            <button onClick={() => openModal(<SignupForm />)}>Sign Up</button>
            <br />
            <br />
            <button onClick={() => openModal(<LoginForm />)}>Log in</button>
            {isOpened && <Modal onClose={closeModal}>{modalContent}</Modal>}
            <SignupForm />
            <LoginForm />
            <SearchAndCalculate />
            {/* <Table /> */}
        </div>
    )
}
