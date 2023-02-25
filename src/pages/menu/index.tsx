import { del } from '@api'
import { useUserStore } from '@data/user'
import Button from '@ui/Button'
import Table from '@ui/Table'
import React from 'react'
import styles from './index.module.scss'
import { shallow } from 'zustand/shallow'

const Menu = () => {
    const { menus, removeMenu } = useUserStore(
        (state) => ({
            menus: state.menus,
            removeMenu: state.removeMenu,
        }),
        shallow
    )

    async function deleteMenu(id: string | number) {
        const result = await del(`/products/menu/${id}/`)
        if (result.hasError) {
            console.error('Error deleting menu', result)
            return
        }
        removeMenu(id)
    }

    console.log('menus from page', menus)
    return (
        <div className={styles.menu}>
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
