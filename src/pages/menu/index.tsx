import { useUserStore } from '@data/user'
import React from 'react'
import styles from './index.module.scss'
import { fetchMenuDelete, fetchPatchUserMenu } from '@api/methods'
import SingleMenu from './SingleMenu'
import { useProductStore } from '@data/products'
import { PatchMenuConfig } from '@data/user'
import { wait } from '@helpers/wait'

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

    const { products, fetchSelectedProductsFullData, setSelectedProducts } =
        useProductStore((state) => ({
            products: state.products,
            fetchSelectedProductsFullData: state.fetchSelectedProductsFullData,
            setSelectedProducts: state.setSelectedProducts,
        }))

    async function deleteMenuHandler(id: number) {
        try {
            await fetchMenuDelete({ id })
            removeMenu(id)
        } catch (error) {
            console.error(error)
        }
    }

    async function patchMenuHandler(
        config: PatchMenuConfig,
        order: 'fetchFirst' | 'storeFirst' = 'fetchFirst'
    ) {
        try {
            // throw new Error()
            console.log('order', order)
            if (order === 'fetchFirst') {
                await fetchPatchUserMenu(config.id, config)
                patchMenu(config)
                return true
            }
            patchMenu(config)

            const result = fetchPatchUserMenu(config.id, config)
                .then(() => true)
                .catch((error) => {
                    console.error(error)
                    return false
                })
            return result
        } catch (error) {
            console.error(error)
            return false
        }
    }
    // async function patchMenuHandler(
    //     config: PatchMenuConfig,
    //     order: 'fetchFirst' | 'storeFirst' = 'fetchFirst'
    // ) {
    //     try {
    //         // throw new Error()
    //         console.log('order', order)
    //         if (order === 'fetchFirst') {
    //             await fetchPatchUserMenu(config.id, config)
    //             patchMenu(config)
    //             return true
    //         }
    //         patchMenu(config)

    //         const result = fetchPatchUserMenu(config.id, config)
    //             .then(() => true)
    //             .catch((error) => {
    //                 console.error(error)
    //                 return false
    //             })
    //         return result
    //     } catch (error) {
    //         console.error(error)
    //         return false
    //     }
    // }

    return (
        <div className={styles.menu}>
            {!user && <h2>Log in to see or create your menus</h2>}
            {menus.map((menu) => {
                return (
                    <SingleMenu
                        products={products}
                        fetchSelectedProductsFullData={
                            fetchSelectedProductsFullData
                        }
                        setGlobalSelectedProducts={setSelectedProducts}
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
