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
import { createIdToQuantityMapping } from '@helpers/createIdToQuantityMapping'

const SearchAndCalculate = () => {
    const {
        clearSelectedProducts,
        removeProductFromSelected,
        selectedProducts,
        clearTotalNutrients,
        addProduct,
        products,
        setTotalNutrients,
    } = useProductStore((state) => ({
        removeProductFromSelected: state.removeProductFromSelected,
        clearSelectedProducts: state.clearSelectedProducts,
        clearTotalNutrients: state.clearTotalNutrients,
        addProduct: state.addProduct,
        products: state.products,
        selectedProducts: state.selectedProducts,
        setTotalNutrients: state.setTotalNutrients,
    }))
    const totalNutrients = useProductStore((state) => state.totalNutrients)
    const setNeedToRecalculate = useProductStore(
        (state) => state.setNeedToRecalculate
    )
    const needToRecalculate = useProductStore(
        (state) => state.needToRecalculate
    )

    const [showAddNewMenuWindow, setShowAddNewMenuWindow] = useState(false)

    const getData = async () => {
        const findIdCrossings = (firstArr: string[], secondArr: string[]) =>
            firstArr.filter((value) => !secondArr.includes(value))

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

        const ids = Object.keys(selectedProducts)
        try {
            const result = await fetchProductListById({ ids })
            addProduct(result)
        } catch (error) {
            console.error(error)
            return
        }

        try {
            const calculations = await fetchNutrientCalculation(
                createIdToQuantityMapping(selectedProducts)
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
        'Product(s) need to be recalculated'

    useEffect(() => {
        isAnyProductSelected && setNeedToRecalculate(true)
    }, [selectedProducts])

    return (
        <div className={styles.container}>
            <Search />
            {isAnyProductSelected ? (
                <Button onClick={clearDataHandler}>Clear all</Button>
            ) : null}

            <SelectedProducts data={selectedProducts} />

            <div style={{ position: 'relative' }}>
                {isAnyProductSelected && totalNutrients ? (
                    <Button
                        onClick={() => {
                            setShowAddNewMenuWindow(true)
                        }}
                    >
                        Save to my menu
                    </Button>
                ) : null}
                <div
                    style={{
                        position: 'absolute',
                        zIndex: 10,
                        top: '0',
                        background: 'white',
                    }}
                >
                    {showAddNewMenuWindow && (
                        <AddMenuForm
                            cornerButton={
                                <button
                                    style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                    }}
                                    onClick={() =>
                                        setShowAddNewMenuWindow(false)
                                    }
                                >
                                    X
                                </button>
                            }
                        />
                    )}
                </div>
            </div>

            <div className={classNames(styles.loader, styles.no)}></div>

            {isAnyProductSelected && (
                <Button
                    disabled={isCalculateDisabled}
                    className={styles.calculateBtn}
                    onClick={() => getData()}
                >
                    Calculate
                </Button>
            )}
            <span>{recalculateNeedMessage}</span>
            {/* <span>
                {' '}
                {isCalculateDisabled && 'Use search, then select your products'}
            </span> */}
            <Table data={totalNutrients} />
        </div>
    )
}

export default SearchAndCalculate
