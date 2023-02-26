import React, { useEffect } from 'react'
import './styles/index.scss'
import SearchAndCalculate from '@pages/searchAndCalculate'
import LoginForm from '@forms/LoginForm'
import Modal from '@common/Modal'
import { useModalStore } from '@data/modal'
import SignupForm from '@forms/SignupForm'
import { getToken, getMe, get } from '@api'
import { useUserStore } from '@data/user'
import Button from '@ui/Button'
import { shallow } from 'zustand/shallow'

export const App = () => {
    const { isOpened, closeModal, modalContent, openModal } = useModalStore()

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

    useEffect(() => {
        console.log('user', user)
        if (user) return
        if (!getToken()) return

        getMe().then((res) => {
            console.log('res', res)
            if (res.hasError) return
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

    useEffect(() => {
        if (!user) return
        get('products/menu/').then((res) => {
            console.log('response', res)
            if (res.hasError) return
            const menus: Products.Menu[] = res.result
            console.log('response result', menus)
            setMenus(menus)
          
        })
    }, [user])

    return (
        <div>
            {isOpened && <Modal onClose={closeModal}>{modalContent}</Modal>}
            <SearchAndCalculate />

        </div>
    )
}
