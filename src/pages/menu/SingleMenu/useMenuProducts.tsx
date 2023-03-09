import { IdToValueMapping } from '@api/methods'
import { deepCopy } from '@helpers/deepCopy'
import { findIdCrossings } from '@helpers/findIdCrossings'
import { SingleMenuProps } from './index'

import { findDifference } from '@helpers/findDifference'
import { useImmer } from 'use-immer'
import { MenuAction } from './useMenuControls'

type ChangedProducts = {
    totalIdToQuantityMapping: IdToValueMapping
    removedProductsIds: string[]
    changeOccured: boolean
}

function getProductChangingsToPatch(
    currentMenu: Products.Menu,
    selectedProducts: Products.Selected
): ChangedProducts {
    const was = currentMenu.products
    if (!was)
        return {
            totalIdToQuantityMapping: {},
            // addedProductsIds: [],
            removedProductsIds: [],
            changeOccured: false,
        }

    const now = selectedProducts,
        totalIdToQuantityMapping: IdToValueMapping = {},
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

    removedProductsIds.forEach((id) => (totalIdToQuantityMapping[+id] = 0))

    return {
        totalIdToQuantityMapping,
        removedProductsIds,
        changeOccured,
    }
}

type UseMenuProductsProps = {
    menu: SingleMenuProps['menu']
    products: SingleMenuProps['products']
    fetchSelectedProductsFullData: SingleMenuProps['fetchSelectedProductsFullData']
}

export const useMenuProducts = ({
    menu,
    products,
    fetchSelectedProductsFullData,
}: UseMenuProductsProps) => {
    const [selectedProducts, setSelectedProducts] = useImmer(() =>
        deepCopy<Products.Selected>(menu.products)
    )

    function removeProductFromSelected(product: Products.ItemSelected) {
        setSelectedProducts((draft) => void delete draft[product.id])
    }

    async function addProductToSelected(product: Products.ItemSelected) {
        setSelectedProducts((draft) => {
            draft[product.id] = { ...product, isLoading: true }
        })

        const result = await fetchSelectedProductsFullData({
            [product.id]: product,
        })

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
        setSelectedProducts(
            (draft) => void (draft[product.id].quantity = quantity)
        )
    }

    async function initialProductsFetch(
        selectedProducts: Products.Selected,
        dispatch: (value: MenuAction) => void
    ) {
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

    return {
        atLeastOneLoadingProduct,
        selectedProducts,
        removeProductFromSelected,
        addProductToSelected,
        setProductQuantity,
        setSelectedProducts,
        initialProductsFetch,
        getProductChangingsToPatch,
    }
}
