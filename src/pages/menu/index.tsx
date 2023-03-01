import { useUserStore } from '@data/user'
import Button from '@ui/Button'
import Table from '@ui/Table'
import React, { useEffect } from 'react'
import styles from './index.module.scss'
import { shallow } from 'zustand/shallow'
import { fetchMenuDelete, fetchPatchUserMenu, addMenuIdsQueryParams } from '@api/methods'
import OneMenu from './OneMenu'
import { useProductStore } from '@data/products'

const Menu = () => {
    const { user, menus, removeMenu, patchMenu } = useUserStore(
        (state) => ({
            menus: state.menus,
            removeMenu: state.removeMenu,
            patchMenu: state.patchMenu,
            user: state.user,
        })
        // shallow
    )

    useEffect(() => {
        console.log('menus', menus)
    }, [menus])

    async function deleteMenuHandler(id: number) {
        try {
            await fetchMenuDelete({ id })
            removeMenu(id)
        } catch (error) {
            console.error(error)
        }
    }

    async function patchMenuHandler(
        id: number,
        idtToQuantityMapping: addMenuIdsQueryParams
    ) {
        try {
            await fetchPatchUserMenu(id, idtToQuantityMapping)
            patchMenu(id, idtToQuantityMapping)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className={styles.menu}>
            {!user && <h2>Log in to see or create your menus</h2>}
            {menus.map((menu) => {
                return (
                    <OneMenu
                        key={menu.id}
                        menu={menu}
                        deleteMenu={deleteMenuHandler}
                        patchMenu={patchMenuHandler}
                    />
                )
            })}
        </div>
    )
}

export default Menu
