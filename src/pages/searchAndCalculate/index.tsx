import React, { useEffect, useState } from 'react'
import { useProductStore } from '@data/products'
import Button from '@ui/Button'
import Search from '@ui/Search'
import SelectedProducts from '@ui/SelectedProducts'
import Table from '@ui/Table'

import styles from './index.module.scss'
import AddMenuForm from '@forms/AddMenuForm'
import { calculateTotalNutrients } from '@helpers/calculateTotalNutrients'
import classNames from 'classnames'
import { fetchNutrientCalculation, fetchProductListById } from '@api/methods'
import { createProductIdToQuantityMapping } from '@helpers/createProductIdToQuantityMapping'
import { findIdCrossings } from '@helpers/findIdCrossings'
import { useUserStore } from '@data/user'
import AddNewMenuWindow from './addMenuWindow'

const SearchAndCalculate = () => {
    const {
        clearSelectedProducts,
        removeProductFromSelected,
        selectedProducts,
        clearTotalNutrients,
        // addProduct,
        addProductToSelected,
        products,
        setTotalNutrients,
        totalNutrients,
        needToRecalculate,
        setNeedToRecalculate,
        fetchSelectedProductsFullData,
        setProductQuantity,
        setSelectedProductLoading,
        fetchAndAddProductToSelected,
    } = useProductStore((state) => ({
        removeProductFromSelected: state.removeProductFromSelected,
        clearSelectedProducts: state.clearSelectedProducts,
        clearTotalNutrients: state.clearTotalNutrients,
        // addProduct: state.addProduct,
        addProductToSelected: state.addProductToSelected,
        products: state.products,
        selectedProducts: state.selectedProducts,
        setTotalNutrients: state.setTotalNutrients,
        totalNutrients: state.totalNutrients,
        needToRecalculate: state.needToRecalculate,
        setNeedToRecalculate: state.setNeedToRecalculate,
        setProductQuantity: state.setProductQuantity,
        fetchSelectedProductsFullData: state.fetchSelectedProductsFullData,
        setSelectedProductLoading: state.setSelectedProductLoading,
        fetchAndAddProductToSelected: state.fetchAndAddProductToSelected,
    }))

    const userData = useUserStore((state) => state.user?.data)
    const menus = useUserStore((state) => state.menus)

    const [showAddNewMenuWindow, setShowAddNewMenuWindow] = useState(false)

    // async function addProduct(product: Products.ItemSelected) {
    //     addProductToSelected(product)

    //     const result = await fetchSelectedProductsFullData({
    //         [product.id]: product,
    //     })
    //     if (!result) removeProductFromSelected(product)
    //     setSelectedProductLoading(product.id, false)
    // }

    useEffect(() => {
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
    }, [selectedProducts, products])

    const clearDataHandler = () => {
        clearSelectedProducts()
        clearTotalNutrients()
    }
    const isAnyProductWithoutValue = Object.values(selectedProducts).some(
        (product) => product.quantity === 0
    )
    const isAnyProductSelected = Object.keys(selectedProducts).length > 0

    useEffect(() => {
        setShowAddNewMenuWindow(false)
    }, [menus])

    return (
        <div className={styles.searchAndCalculate}>
            <Search
                selectedProducts={selectedProducts}
                addProductToSelected={fetchAndAddProductToSelected}
            />
            {isAnyProductSelected ? (
                <Button onClick={clearDataHandler} size="small" bordered>
                    delete products
                </Button>
            ) : null}

            <SelectedProducts
                editMode={true}
                products={selectedProducts}
                remove={removeProductFromSelected}
                setQuantity={setProductQuantity}
            />

            <div className={classNames(styles.loader, styles.no)}></div>

            {/* {isAnyProductSelected && (
                <Button
                    disabled={isCalculateDisabled}
                    className={styles.calculateBtn}
                    onClick={() => getData()}
                    size="medium"
                    bordered
                >
                    calculate
                </Button>
            )} */}
            {/* <span className={styles.text}>{recalculateNeedMessage}</span> */}

            <div style={{ position: 'relative', margin: '10px 0' }}>
                {userData && isAnyProductSelected && totalNutrients ? (
                    <Button
                        onClick={() => {
                            setShowAddNewMenuWindow(true)
                        }}
                        bordered
                    >
                        save to my menu
                    </Button>
                ) : null}

                <AddNewMenuWindow
                    setShowAddNewMenuWindow={setShowAddNewMenuWindow}
                    showAddNewMenuWindow={showAddNewMenuWindow}
                ></AddNewMenuWindow>
            </div>
            <Table data={totalNutrients} />
        </div>
    )
}

export default SearchAndCalculate
