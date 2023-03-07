import { fetchProductListById, ProductIdToQuantityMapping } from '@api/methods'
import { getProductsById, ProductState, useProductStore } from '@data/products'
import { useUserStore } from '@data/user'
import { calculateTotalNutrients } from '@helpers/calculateTotalNutrients'
import { deepCopy } from '@helpers/deepCopy'
import { findIdCrossings } from '@helpers/findIdCrossings'
import Button from '@ui/Button'
import SelectedProducts from '@ui/SelectedProducts'
import Table from '@ui/Table'
import React, {
    Reducer,
    useEffect,
    useLayoutEffect,
    useReducer,
    useState,
} from 'react'
import { createProductIdToQuantityMapping } from '@helpers/createProductIdToQuantityMapping'
import Search from '@ui/Search'
import { isEmpty } from '@helpers/isEmpty'
import { OneMenuProps } from './index'

import { UserState } from '@data/user'
import { findDifference } from '@helpers/findDifference'
import produce from 'immer'
import { useImmer, useImmerReducer } from 'use-immer'

type UseMenuProps = {
    menu: OneMenuProps['menu']
    products: OneMenuProps['products']
    fetchSelectedProductsFullData: OneMenuProps['fetchSelectedProductsFullData']
}
// const menus = useUserStore((state) => state.menus)
type ChangedProducts = {
    totalIdToQuantityMapping: ProductIdToQuantityMapping
    // addedProductsIds: string[]
    removedProductsIds: string[]
    changeOccured: boolean
}

type ProductLoading = {
    name: string
    isLoading: boolean
}

type ReducerState = {
    initialLoading: boolean
    editMode: boolean
    showSearch: boolean
    showSaveButton: boolean
}

const initialState: ReducerState = {
    initialLoading: false,
    editMode: false,
    showSearch: false,
    showSaveButton: false,
}

// const decreaseAction: Action = {
//     type: ActionKind.Decrease,
//     payload: 1
//   }

// const immerReducer = (reducer: Reducer<ReducerState, Action>) => {
//     return (state: ReducerState, action: Action) => {
//         return produce(state, (draft) => {
//             reducer(draft, action)
//         })
//     }
// }

type Action =
    | { type: 'InitialLoadingOff' }
    | { type: 'InitialLoadingOn' }
    | { type: 'SAVE_CHANGES_CLEANUP' }
    | { type: 'EDIT_MODE_ON' }
    | { type: 'EDIT_MODE_OFF' }
    | { type: 'SHOW_SEARCH' }
    | { type: 'CLOSE_SEARCH' }
    | { type: 'SHOW_SAVE_BUTTON' }
    | { type: 'HIDE_SAVE_BUTTON' }

function reducer(state: ReducerState, action: Action) {
    if (action.type === 'InitialLoadingOn') state.initialLoading = true
    if (action.type === 'InitialLoadingOff') state.initialLoading = false
    if (action.type === 'EDIT_MODE_OFF') {
        state.editMode = false
        state.showSearch = false
        state.showSaveButton = false
    }
    if (action.type === 'EDIT_MODE_ON') state.editMode = true
    if (action.type === 'SHOW_SEARCH') state.showSearch = true
    if (action.type === 'SHOW_SAVE_BUTTON') state.showSaveButton = true
    if (action.type === 'HIDE_SAVE_BUTTON') state.showSaveButton = false
    return state
}

export type SelectedProductsToLoad = Record<Products.Id, ProductLoading>

//todo rename to useSingleMenu
export const useOneMenu = ({
    menu,
    products,
    fetchSelectedProductsFullData,
}: UseMenuProps) => {
    const [selectedProducts, setSelectedProducts] = useImmer(() =>
            deepCopy<Products.Selected>(menu.products)
        ),
        [totalNutrients, setTotalNutrients] = useState(() =>
            deepCopy<Nutrients.NamesToItems>(menu.nutrients)
        ),
        { totalIdToQuantityMapping, changeOccured } =
            getProductChangingsToPatch()
    const [menuState, dispatch] = useImmerReducer(reducer, initialState)
    const { editMode } = menuState

    function backToInitialProducts() {
        dispatch({ type: 'EDIT_MODE_OFF' })
        setSelectedProducts(() => menu.products)
    }

    function editButtonHandler() {
        if (menuState.editMode) {
            dispatch({ type: 'EDIT_MODE_OFF' })
            setSelectedProducts(() => menu.products)
            return
        }
        initialProductsFetch(selectedProducts)
        dispatch({ type: 'EDIT_MODE_ON' })
    }

    function removeProductFromSelected(product: Products.ItemSelected) {
        // dispatch({ type: 'SHOW_SAVE_BUTTON' })
        setSelectedProducts((draft) => void delete draft[product.id])
    }

    useEffect(() => {
        console.log('@@', selectedProducts)
    }, [selectedProducts])

    async function addProductToSelected(product: Products.ItemSelected) {
        // dispatch({ type: 'SHOW_SAVE_BUTTON' })

        setSelectedProducts((draft) => {
            draft[product.id] = { ...product, isLoading: true }
        })

        const result = await fetchSelectedProductsFullData({
            [product.id]: product,
        })
        console.log('@@result', result)

        if (result) {
            setSelectedProducts(
                (draft) => void (draft[product.id].isLoading = false)
            )
            return
        }
        setSelectedProducts((draft) => void delete draft[product.id])
    }

    function setProductQuantity(
        product: Products.ItemSelected,
        quantity: number
    ) {
        // dispatch({ type: 'SHOW_SAVE_BUTTON' })
        setSelectedProducts(
            (draft) => void (draft[product.id].quantity = quantity)
        )
    }

    function getProductChangingsToPatch(): ChangedProducts {
        // todo: menu -> currentMenu
        const was = menu.products
        if (!was)
            return {
                totalIdToQuantityMapping: {},
                // addedProductsIds: [],
                removedProductsIds: [],
                changeOccured: false,
            }

        const now = selectedProducts,
            totalIdToQuantityMapping: ProductIdToQuantityMapping = {},
            wasIds = Object.keys(was),
            nowIds = Object.keys(now),
            removedProductsIds = findDifference(wasIds, nowIds)

        let changeOccured = wasIds.length !== nowIds.length

        for (const id in now) {
            if (now[id].quantity === 0) removedProductsIds.push(id)
            const newProductAppeared = was[id] == undefined
            if (newProductAppeared) {
                changeOccured = true
                totalIdToQuantityMapping[id] = now[id].quantity
                continue
            }
            if (now[id].quantity !== was[id].quantity) changeOccured = true
            totalIdToQuantityMapping[id] = now[id].quantity
        }

        removedProductsIds.forEach((id) => (totalIdToQuantityMapping[id] = 0))

        return {
            totalIdToQuantityMapping,
            removedProductsIds,
            changeOccured,
        }
    }

    async function initialProductsFetch(selectedProducts: Products.Selected) {
        const productIdsToFetch = findIdCrossings(
            Object.keys(selectedProducts),
            Object.keys(products)
        )
        const needToFetch = productIdsToFetch.length > 0
        needToFetch && console.log('GOING TO FETCH')
        if (needToFetch) {
            setSelectedProducts((draft) => {
                Object.values(draft).forEach((product) => {
                    draft[product.id] = { ...product, isLoading: true }
                })
            })
            dispatch({ type: 'InitialLoadingOn' })
            await fetchSelectedProductsFullData(selectedProducts)
            dispatch({ type: 'InitialLoadingOff' })
            setSelectedProducts((draft) => {
                Object.values(draft).forEach((product) => {
                    draft[product.id] = { ...product, isLoading: false }
                })
            })
        }
    }

    const atLeastOneLoadingProduct = Object.values(selectedProducts).some(
        (product) => product.isLoading
    )

    useEffect(() => {
        if (!editMode) {
            return
        }

        const productIdsToFetch = findIdCrossings(
            Object.keys(selectedProducts),
            Object.keys(products)
        )

        if (productIdsToFetch.length > 0) return

        const totalNutrients = calculateTotalNutrients(
            selectedProducts,
            products
        )
        setTotalNutrients(totalNutrients)
    }, [selectedProducts, editMode, products])

    useLayoutEffect(() => {
        if (atLeastOneLoadingProduct || !changeOccured) {
            dispatch({ type: 'HIDE_SAVE_BUTTON' })
            return
        }
        dispatch({ type: 'SHOW_SAVE_BUTTON' })
    }, [selectedProducts])

    useEffect(() => {
        if (!menu) return
        // setSelectedProducts(deepCopy(menu.products))
    }, [menu])

    return {
        selectedProducts,
        editMode,
        totalNutrients,
        removeProductFromSelected,
        addProductToSelected,
        setProductQuantity,
        totalIdToQuantityMapping,
        editButtonHandler,
        menuState,
        backToInitialProducts,
        dispatch,
    }
}
