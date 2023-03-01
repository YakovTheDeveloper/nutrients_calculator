import { fetchProductListById, ProductIdToQuantityMapping } from '@api/methods'
import { ProductState, useProductStore } from '@data/products'
import { useUserStore } from '@data/user'
import { calculateTotalNutrients } from '@helpers/calculateTotalNutrients'
import { deepCopy } from '@helpers/deepCopy'
import { findIdCrossings } from '@helpers/findIdCrossings'
import Button from '@ui/Button'
import SelectedProducts from '@ui/SelectedProducts'
import Table from '@ui/Table'
import React, { useEffect, useReducer, useState } from 'react'
import { createProductIdToQuantityMapping } from '@helpers/createProductIdToQuantityMapping'

type OneMenuProps = {
    menu: Products.Menu
    deleteMenu(id: string | number): Promise<void>
    patchMenu(
        id: number,
        idtToQuantityMapping: ProductIdToQuantityMapping
    ): Promise<void>
}

const OneMenu = ({ menu, deleteMenu, patchMenu }: OneMenuProps) => {
    // const products = deepCopy<Data.SelectedProducts>(menu.products)

    const { products, addProduct } = useProductStore((state) => ({
        products: state.products,
        addProduct: state.addProduct,
    }))

    const menus = useUserStore((state) => state.menus)

    useEffect(() => {
        if (!menu) return
        setSelectedProducts(deepCopy(menu.products))
    }, [menu])

    const [selectedProducts, setSelectedProducts] = useState(() =>
        deepCopy<Data.SelectedProducts>(menu.products)
    )

    const [totalNutrients, setTotalNutrients] = useState(() =>
        deepCopy<Nutrients.NamesToItems>(menu.nutrients)
    )

    const [editMode, setEditMode] = useState(false)
    const [showSaveButton, setShowSaveButton] = useState(false)

    const [isRecalculateNeeded, setIsRecalculateNeeded] =
        useState<boolean>(false)

    function needToRecalculate(status: boolean) {
        setIsRecalculateNeeded(status)
    }

    function removeProductFromSelected(product: Data.SelectedProduct) {
        setSelectedProducts((prev) => {
            const { [product.id]: value, ...rest } = prev
            return { ...rest }
        })
    }

    function setProductQuantity(
        product: Data.SelectedProduct,
        quantity: number
    ) {
        setSelectedProducts((prev) => {
            return {
                ...prev,
                [product.id]: {
                    ...prev[product.id],
                    quantity,
                },
            }
        })
    }

    function getChangedProducts(): ProductIdToQuantityMapping {
        console.log('getChangedProducts')
        const was = menus.find(({ id }) => id === menu.id)?.products
        if (!was) return {}
        const now = selectedProducts
        const idToQuantityMapping: ProductIdToQuantityMapping = {}

        for (const id in now) {
            if (now[id].quantity === was[id].quantity) continue
            idToQuantityMapping[id] = now[id].quantity
        }

        const wasIds = Object.keys(was)
        const nowIds = Object.keys(now)

        const findDifference = (arr1: any[], arr2: any[]) =>
            arr1.filter((num) => !arr2.includes(num))

        const removedProductsIds = findDifference(wasIds, nowIds)
        removedProductsIds.forEach((id) => (idToQuantityMapping[id] = 0))

        return idToQuantityMapping
    }

    async function fetchProductsAndAddToGlobalStore() {
        const ids = Object.keys(selectedProducts).toString()
        console.log('ids', ids)
        try {
            const response = await fetchProductListById({ ids })
            addProduct(response.result)
        } catch (error) {
            console.error(error)
            return
        }
    }

    useEffect(() => {
        // console.log('getChangedProducts', getChangedProducts())
    }, [selectedProducts])

    useEffect(() => {
        if (!editMode) return
        const productIdsToFetch = findIdCrossings(
            Object.keys(selectedProducts),
            Object.keys(products)
        )
        const needToFetch = productIdsToFetch.length !== 0
        console.log('needToFetch:', needToFetch)
        if (needToFetch) {
            fetchProductsAndAddToGlobalStore()
        }
    }, [editMode])

    useEffect(() => {
        console.log('selectedProducts', selectedProducts)
        if (!editMode) return

        setShowSaveButton(true)

        const productIdsToFetch = findIdCrossings(
            Object.keys(selectedProducts),
            Object.keys(products)
        )

        if (productIdsToFetch.length === 0) {
            const totalNutrients = calculateTotalNutrients(
                selectedProducts,
                products
            )
            setTotalNutrients(totalNutrients)
        }
    }, [selectedProducts])

    return (
        <div>
            {showSaveButton && (
                <Button
                    onClick={() => {
                        patchMenu(menu.id, getChangedProducts())
                    }}
                >
                    Save changes
                </Button>
            )}
            <Button onClick={() => setEditMode(true)}>Edit menu</Button>
            <SelectedProducts
                editMode={editMode}
                data={selectedProducts}
                remove={removeProductFromSelected}
                selectedProducts={selectedProducts}
                setNeedToRecalculate={needToRecalculate}
                setQuantity={setProductQuantity}
            />
            <Button onClick={() => deleteMenu(menu.id)}>Delete menu</Button>
            <h2>{menu.name}</h2>
            <Table data={totalNutrients}></Table>
        </div>
    )
}

export default OneMenu
