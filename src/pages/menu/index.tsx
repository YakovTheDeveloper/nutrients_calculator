import { useUserStore } from '@data/user'
import React, { useEffect } from 'react'
import styles from './index.module.scss'
import {
    fetchMenuDelete,
    fetchPatchUserMenu,
    IdToValueMapping,
} from '@api/methods'
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

    // const menus = useUserStore((state) => state.menus)

    const { products, fetchSelectedProductsFullData } = useProductStore(
        (state) => ({
            products: state.products,
            fetchSelectedProductsFullData: state.fetchSelectedProductsFullData,
        })
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
        idtToQuantityMapping: IdToValueMapping,
        newProducts?: Products.Selected
    ) {
        try {
            await fetchPatchUserMenu(id, idtToQuantityMapping)
            patchMenu(id, idtToQuantityMapping, newProducts)
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
                        products={products}
                        fetchSelectedProductsFullData={
                            fetchSelectedProductsFullData
                        }
                        key={menu.id}
                        menu={menu}
                        removeMenu={deleteMenuHandler}
                        patchMenuHandler={patchMenuHandler}
                    />
                )
            })}
        </div>
    )
}

export default Menu
