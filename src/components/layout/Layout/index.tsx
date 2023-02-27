import Footer from '@layout/Footer'
import Header from '@layout/Header'
import React from 'react'
import styles from './index.module.scss'
import { Outlet } from 'react-router-dom'

const Layout = () => {
    return (
        <>
            <Header></Header>
            <main className={styles.main}>
                <Outlet />
            </main>
            <Footer></Footer>
        </>
    )
}

export default Layout
