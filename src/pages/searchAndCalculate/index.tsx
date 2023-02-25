import React, { useEffect, useState } from 'react'
import { get, getTyped } from '@api'
import { apiBaseAddress } from '@constants/api'
import { initNutrients } from '@constants/nutrients'
import { useProductStore } from '@data/products'
import { useUserStore } from '@data/user'
import Button from '@ui/Button'
import Search from '@ui/Search'
import SelectedProducts from '@ui/SelectedProducts'
import Table from '@ui/Table'

import styles from './index.module.scss'
import AddMenuForm from '@forms/AddMenuForm'

const SearchAndCalculate = () => {
    const selectedProducts = useProductStore((state) => state.selectedProducts)
    const {
        clearSelectedProducts,
        removeProductFromSelected,
        clearTotalNutrients,
        addProductToSelected,
    } = useProductStore((state) => ({
        removeProductFromSelected: state.removeProductFromSelected,
        clearSelectedProducts: state.clearSelectedProducts,
        clearTotalNutrients: state.clearTotalNutrients,
        addProductToSelected: state.addProductToSelected,
    }))
    const totalNutrients = useProductStore((state) => state.totalNutrients)
    const setNeedToRecalculate = useProductStore(
        (state) => state.setNeedToRecalculate
    )
    const setTotalNutrients = useProductStore(
        (state) => state.setTotalNutrients
    )
    const needToRecalculate = useProductStore(
        (state) => state.needToRecalculate
    )
    const { addMenu } = useUserStore()

    const [showAddNewMenuWindow, setShowAddNewMenuWindow] = useState(false)

    const getData = async () => {
        // const ids = Object.keys(selectedProducts)

        // console.log(`products/by_id/?ids=${ids}`)
        // const result = await getTyped<Products.Item>(
        //     `products/by_id/?ids=${ids}`
        // )

        // if (result.hasError) {
        //     console.error(result.detail)
        //     return
        // }
        // const obj = result.result

        // console.log('result', result)

        // const s: Products.Item = result.result
        // result.result.forEach((product) => {
        //     addProductToSelected(product)
        // })
        // console.log(result)

        const idWithQuantityParams = Object.entries(selectedProducts).reduce(
            (acc, [productId, { quantity }]) => {
                acc += `id${productId}=${quantity}&`
                return acc
            },
            '?'
        )
        console.log('idWithQuantityParams', idWithQuantityParams)
        get(`polls/calculate_nutrients/${idWithQuantityParams}`).then((res) => {
            if (res.hasError) {
                return
            }
            const x: Nutrients.NamesToItems = res.result
            setTotalNutrients(x)
            setNeedToRecalculate(false)
        })
        fetch(
            `${apiBaseAddress}/polls/calculate_nutrients/${idWithQuantityParams}`
        )
            .then((res) => res.json())
            .then((res: Api.Response<Nutrients.NamesToItems>) =>
                setTableData(res.result)
            )
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

    console.log('isAnyProductSelected', isAnyProductSelected)
    console.log('isCalculateDisabled', isCalculateDisabled)

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
            <span>
                {' '}
                {isCalculateDisabled && 'Use search, then select your products'}
            </span>
            <Table data={totalNutrients} />
        </div>
    )
}

export default SearchAndCalculate
