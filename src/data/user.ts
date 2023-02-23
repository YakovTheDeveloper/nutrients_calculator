import { removeToken } from '@api'
import { ReactNode } from 'react'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface UserState {
    user: Pick<Api.User, 'data'> | null
    setUser: (user: Pick<Api.User, 'data'>) => void
    removeUser: () => void
    menus: Products.Menu | null
    setMenus: (menus: Products.Menu) => void
}

export const useUser = create<UserState>()(
    devtools(
        (set) => ({
            user: null,
            menus: null,
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
            setMenus: (menus: Products.Menu) =>
                set((state) => {
                    return { ...state, menus }
                }),
        }),
        {
            name: 'user-storage',
        }
    )
)
