import { useUserStore } from '@data/user'
import Button from '@ui/Button'
import Table from '@ui/Table'
import React from 'react'
import styles from './index.module.scss'
import { shallow } from 'zustand/shallow'
import { fetchMenuDelete } from '@api/methods'
import OneMenu from './OneMenu'
import { useProductStore } from '@data/products'

const Menu = () => {
    const { menus, removeMenu, user } = useUserStore(
        (state) => ({
            menus: state.menus,
            removeMenu: state.removeMenu,
            user: state.user,
        }),
        shallow
    )

    const {
        clearSelectedProducts,
        removeProductFromSelected,
        selectedProducts,
        clearTotalNutrients,
        addProduct,
        products,
        setTotalNutrients,
        totalNutrients,
        needToRecalculate,
        setNeedToRecalculate,
        setProductQuantity,
    } = useProductStore((state) => ({
        removeProductFromSelected: state.removeProductFromSelected,
        clearSelectedProducts: state.clearSelectedProducts,
        clearTotalNutrients: state.clearTotalNutrients,
        addProduct: state.addProduct,
        products: state.products,
        selectedProducts: state.selectedProducts,
        setTotalNutrients: state.setTotalNutrients,
        totalNutrients: state.totalNutrients,
        needToRecalculate: state.needToRecalculate,
        setNeedToRecalculate: state.setNeedToRecalculate,
        setProductQuantity: state.setProductQuantity,
    }))

    async function deleteMenu(id: number) {
        try {
            await fetchMenuDelete({ id })
            removeMenu(id)
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
                        deleteMenu={deleteMenu}
                    />
                )
            })}
        </div>
    )
}

export default Menu
