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

    const menus = useUserStore((state) => state.menus)

    const [showAddNewMenuWindow, setShowAddNewMenuWindow] = useState(false)

    const getData = async () => {
        const productIdsToFetch = findIdCrossings(
            Object.keys(selectedProducts),
            Object.keys(products)
        )

        if (productIdsToFetch.length === 0) {
            console.info('      No crossings, can use offline calculate')
            const totalNutrients = calculateTotalNutrients(
                selectedProducts,
                products
            )
            setTotalNutrients(totalNutrients)
            setNeedToRecalculate(false)
            return
        }

        const ids = Object.keys(selectedProducts).toString()
        try {
            const response = await fetchProductListById({ ids })
            addProduct(response.result)
        } catch (error) {
            console.error(error)
            return
        }

        try {
            const calculations = await fetchNutrientCalculation(
                createProductIdToQuantityMapping(selectedProducts)
            )
            const nutrients = calculations.result
            setTotalNutrients(nutrients)
            setNeedToRecalculate(false)
        } catch (error) {
            console.error(error)
        }
    }

    const clearDataHandler = () => {
        clearSelectedProducts()
        clearTotalNutrients()
    }
    const isAnyProductWithoutValue = Object.values(selectedProducts).some(
        (product) => product.quantity === 0
    )
    const isAnyProductSelected = Object.keys(selectedProducts).length > 0
    const isCalculateDisabled =
        !isAnyProductSelected || isAnyProductWithoutValue

    const recalculateNeedMessage =
        totalNutrients !== null &&
        needToRecalculate === true &&
        ' Product(s) need to be recalculated!'

    useEffect(() => {
        isAnyProductSelected && setNeedToRecalculate(true)
    }, [selectedProducts])

    useEffect(() => {
        setShowAddNewMenuWindow(false)
    }, [menus])

    return (
        <div className={styles.searchAndCalculate}>
            <Search />

            {isAnyProductSelected ? (
                <Button onClick={clearDataHandler} size="small" bordered>
                    delete products
                </Button>
            ) : null}

            <SelectedProducts
                data={selectedProducts}
                remove={removeProductFromSelected}
                selectedProducts={selectedProducts}
                setNeedToRecalculate={setNeedToRecalculate}
                setQuantity={setProductQuantity}
            />

            {isAnyProductSelected && (
                <Button
                    disabled={isCalculateDisabled}
                    className={styles.calculateBtn}
                    onClick={() => getData()}
                    size="medium"
                    bordered
                >
                    calculate
                </Button>
            )}
            <span className={styles.text}>{recalculateNeedMessage}</span>

            <div style={{ position: 'relative', margin: '10px 0' }}>
                {isAnyProductSelected && totalNutrients ? (
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
