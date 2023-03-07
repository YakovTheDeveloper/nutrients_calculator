import { fetchMe, fetchUserMenus } from '@api/methods'
import { useEffect } from 'react'
import { useUserStore } from '@data/user'
import { shallow } from 'zustand/shallow'
import { getToken } from '@api/localStorage'
export function useInitialSetups() {
    const { user, setUser, setMenus, clearStore } = useUserStore(
        (state) => ({
            user: state.user,
            setUser: state.setUser,
            setMenus: state.setMenus,
            clearStore: state.clearStore,
        }),
        shallow
    )

    const fetchMeHandler = async () => {
        try {
            const response = await fetchMe()
            console.log('response', response)
            const userData = response.result
            console.log('res.result', response.result)
            console.log('userData', userData)
            setUser({
                data: {
                    email: userData.email,
                },
            })
        } catch (error) {
            console.error(error)
        }
    }

    const getMenuHandler = async () => {
        try {
            const response = await fetchUserMenus()
            const menus = response.result
            console.log('response result', menus)
            // const categories = groupNutrientsByCategory(menu.nutrients)
            setMenus(menus)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        console.log('user', user)
        if (user) {
            getMenuHandler()
            return
        }

        if (!getToken()) return

        fetchMeHandler()
    }, [user])
}
