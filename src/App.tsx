import React, { useEffect } from 'react'
import './styles/index.scss'
import SearchAndCalculate from '@pages/searchAndCalculate'
import LoginForm from '@forms/LoginForm'
import Modal from '@common/Modal'
import { useModalStore } from '@data/modal'
import SignupForm from '@forms/SignupForm'
import { useUserStore } from '@data/user'
import Button from '@ui/Button'
import { shallow } from 'zustand/shallow'
import { getToken } from '@api/localStorage'
import { fetchMe, fetchUserMenu } from '@api/methods'

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

    const fetchMeHandler = async () => {
        try {
            const response = await fetchMe()
            console.log('response', response)
            const userData = response.result
            console.log('res.result', response.result)
            console.log('userData', userData)
            setUser({
                data: {
                    email: userData.email,
                },
            })
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        console.log('user', user)
        if (user) return
        if (!getToken()) return

        fetchMeHandler()

        // getMe().then((res) => {
        //     console.log('res', res)
        //     if (res.hasError) return
        //     const userData = res.result
        //     console.log('res.result', res.result)
        //     console.log('userData', userData)
        //     setUser({
        //         data: {
        //             email: userData.email,
        //         },
        //     })
        // })
    }, [user])

    const getMenuHandler = async () => {
        try {
            const response = await fetchUserMenu()
            const menus = response.result
            console.log('response result', menus)
            setMenus(menus)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (!user) return
        getMenuHandler()
    }, [user])

    // console.log('going to add', {
    //     id: menu.id,
    //     name: menu.name,
    //     description: menu.description,
    //     nutrients: menu.nutrients,
    //     products: menu.products,
    // })
    // addMenu({
    //     id: menu.id,
    //     name: menu.name,
    //     description: menu.description,
    //     nutrients: menu.nutrients,
    //     products: menu.products,
    // })

    // depend on user.data

    return (
        <div>
            {isOpened && <Modal onClose={closeModal}>{modalContent}</Modal>}
            <SearchAndCalculate />
        </div>
    )
}
