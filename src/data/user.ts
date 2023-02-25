import { removeToken } from '@api'
import { ReactNode } from 'react'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface UserState {
    user: Pick<Api.User, 'data'> | null
    setUser: (user: Pick<Api.User, 'data'>) => void
    removeUser: () => void
    menus: Products.Menu[]
    setMenus: (menus: Products.Menu[]) => void
    addMenu: (menu: Products.Menu) => void
    removeMenu: (id: number | string) => void
    clearStore: () => void
}

export const useUserStore = create<UserState>()(
    devtools(
        (set) => ({
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
            removeMenu: (id: number | string) =>
                set((state) => {
                    const menusWithoutDeleted = state.menus.filter(
                        (el) => el.id !== id
                    )
                    return { ...state, menus: menusWithoutDeleted }
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
        }),
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
