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
import { fetchMe, fetchUserMenus } from '@api/methods'
import Layout from '@layout/Layout'
import { useInitialSetups } from '@hooks/useInitialSetups'

export const App = () => {
    const { isOpened, closeModal, modalContent } = useModalStore()
    const userData = useUserStore((state) => state.user?.data)

    useInitialSetups()

    useEffect(() => {
        if (!userData) return
        closeModal()
    }, [userData])

    return (
        <>
            {isOpened && <Modal onClose={closeModal}>{modalContent}</Modal>}
            <Layout />
        </>
    )
}
