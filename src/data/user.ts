import { SelectedProduct } from './../types/index.d'
import { removeToken } from '@api/localStorage'
import { IdToValueMapping } from '@api/methods'
import { ReactNode } from 'react'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { isEmpty } from '@helpers/isEmpty'
import { immer } from 'zustand/middleware/immer'

export interface UserState {
    user: Pick<Api.User, 'data'> | null
    setUser: (user: Pick<Api.User, 'data'>) => void
    removeUser: () => void
    menus: Products.Menu[]
    setMenus: (menus: Products.Menu[]) => void
    addMenu: (menu: Products.Menu) => void
    removeMenu: (id: number) => void
    patchMenu: (
        id: number,
        idToQuantityMapping: IdToValueMapping,
        newProducts?: Products.Selected
    ) => void
    clearStore: () => void
}

export const useUserStore = create<UserState>()(
    devtools(
        immer((set, get) => ({
            user: null,
            menus: [],
            setUser: (user) =>
                set((state) => ({
                    ...state,
                    user,
                })),
            removeUser: () =>
                set((state) => {
                    removeToken()
                    return { ...state, user: null }
                }),
            setMenus: (menus: Products.Menu[]) =>
                set((state) => {
                    return { ...state, menus }
                }),
            addMenu: (menu: Products.Menu) =>
                set((state) => {
                    const menusWithNew = [...state.menus, menu]
                    return { ...state, menus: menusWithNew }
                }),
            removeMenu: (id: number) =>
                set((state) => {
                    const index = state.menus.findIndex(
                        (menu) => menu.id === id
                    )
                    state.menus.splice(index, 1)
                }),
            patchMenu: (id, idToQuantityMapping, newProducts) =>
                set((state) => {
                    const menu = state.menus.find(
                        (menu: Products.Menu) => menu.id === id
                    )
                    if (!menu) return state
                    for (const [id, quantity] of Object.entries(
                        idToQuantityMapping
                    )) {
                        const product = menu.products[+id]
                        if (!product) continue
                        if (quantity === 0) {
                            // menu.products[+id] = null
                            delete menu.products[+id]
                            continue
                        }
                        product.quantity = quantity
                    }

                    if (newProducts && isEmpty(newProducts) === false) {
                        for (const [id, product] of Object.entries(newProducts))
                            if (product.quantity > 0)
                                menu.products[+id] = product
                    }

                    // return state
                    // const menu = state.menus[id].products
                }),
            clearStore: () =>
                set((state) => {
                    removeToken()
                    return {
                        ...state,
                        user: null,
                        menus: [],
                    }
                }),
            // patchMenu: (id, idToQuantityMapping, newProducts) =>
            //     set((state) => {
            //         console.log('@@', newProducts)
            //         const menusWithPatched = state.menus.map((menu) => {
            //             if (menu.id !== id) return menu
            //             const newMenu = { ...menu }
            //             for (const productId in menu.products) {
            //                 if (productId in idToQuantityMapping) {
            //                     const quantity = idToQuantityMapping[productId]
            //                     if (quantity === 0)
            //                         delete newMenu.products[+productId]
            //                     else
            //                         newMenu.products[+productId].quantity =
            //                             quantity
            //                 }
            //             }

            //             if (newProducts && isEmpty(newProducts) === false) {
            //                 newMenu.products = {
            //                     ...newMenu.products,
            //                     ...newProducts,
            //                 }
            //             }

            //             return newMenu
            //         })
            //         console.log('menusWithPatched', menusWithPatched)
            //         return { ...state, menus: menusWithPatched }
            //     }),
        })),
        {
            name: 'user-storage',
            serialize: {
                options: {
                    map: true,
                },
            } as any,
        }
    )
)
