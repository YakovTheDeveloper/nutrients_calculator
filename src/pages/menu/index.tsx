import { useUserStore } from '@data/user'
import Button from '@ui/Button'
import Table from '@ui/Table'
import React from 'react'
import styles from './index.module.scss'
import { shallow } from 'zustand/shallow'
import { fetchMenuDelete } from '@api/methods'

const Menu = () => {
    const { menus, removeMenu, user } = useUserStore(
        (state) => ({
            menus: state.menus,
            removeMenu: state.removeMenu,
            user: state.user,
        }),
        shallow
    )

    async function deleteMenu(id: string | number) {
        try {
            await fetchMenuDelete({ id })
            removeMenu(id)
        } catch (error) {
            console.error(error)
        }
    }

    console.log('menus from page', menus)
    return (
        <div className={styles.menu}>
            {!user && <h2>Log in to see or create your menus</h2>}
            {menus.map((menu) => {
                return (
                    <>
                        <Button onClick={() => deleteMenu(menu.id)}>
                            Delete menu
                        </Button>
                        <h2>{menu.name}</h2>
                        <Table data={menu.nutrients}></Table>
                    </>
                )
            })}
        </div>
    )
}

export default Menu
