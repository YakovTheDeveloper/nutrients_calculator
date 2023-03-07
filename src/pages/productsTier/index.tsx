import React, { useEffect, useRef, useState } from 'react'
import {
    fetchNutrientCalculation,
    fetchProductListById,
    fetchProductsByNutrient,
} from '@api/methods'
import { useProductStore } from '@data/products'
import { calculateTotalNutrients } from '@helpers/calculateTotalNutrients'
import { isEmpty } from '@helpers/isEmpty'
import Button from '@ui/Button'
import SelectedProducts from '@ui/SelectedProducts'
import Table from '@ui/Table'
import styles from './index.module.scss'
import { useLocation } from 'react-router-dom'
import { nutrientNameNormalized } from '@constants/nutrients'
import ListItem from '@ui/Search/ListItem'
import { getDailyNormPercent } from '@helpers/calculations/getDailyNormPercent'
import Loader from '@ui/PreLoader'
import { wait } from '@helpers/wait'
import { groupNutrientsByCategory } from '@helpers/mappers'

const ProductsTier = () => {
    // fetchProductsByNutrient({ id: 'copper' })

    const {
        selectedProducts,
        addProductToSelected,
        productsTier,
        fetchAndAddTierProducts,
    } = useProductStore((state) => ({
        selectedProducts: state.selectedProducts,
        addProductToSelected: state.addProductToSelected,
        productsTier: state.productsTier,
        fetchAndAddTierProducts: state.fetchAndAddTierProducts,
    }))

    const [currentNutrient, setCurrentNutrient] =
        useState<Nutrients.Name>('protein')

    const [productsLoading, setProductsLoading] = useState(false)

    const [currentProducts, setCurrentProducts] = useState<
        Products.ItemWithSingleNutrient[]
    >(productsTier[currentNutrient] || [])

    const nutrientNames = Object.entries(nutrientNameNormalized) as [
        Nutrients.Name,
        string
    ][]

    async function getProductsHandler(
        nutrient: Nutrients.Name,
        productsIsInGlobalStore: Products.ItemWithSingleNutrient[] | undefined
    ) {
        if (productsIsInGlobalStore) {
            setCurrentProducts(productsIsInGlobalStore)
            return
        }
        setProductsLoading(true)
        const result = await fetchAndAddTierProducts(nutrient)
        result && setCurrentProducts(result)
        setProductsLoading(false)
    }

    const tab = useRef<HTMLInputElement>(null)

    useEffect(() => {
        // if (!currentNutrient) return

        const productsInGlobalStore = productsTier[currentNutrient]
        // const timeoutMs = productsInGlobalStore ? 0 : 100
        const result = getProductsHandler(
            currentNutrient,
            productsInGlobalStore
        )
        // const handler = setTimeout(() => {
        //     getProductsHandler(currentNutrient, productsInGlobalStore)
        //     // fetchAndAddTierProducts(currentNutrient)
        // }, timeoutMs)
        // return () => Promise.reject(result)
        // return () => clearTimeout(handler)
    }, [currentNutrient])

    const getShowLoaderStatus = (nutrientName: Nutrients.Name) => {
        return productsLoading && currentNutrient === nutrientName
    }

    // const nutrientsByCategory = groupNutrientsByCategory<string>(
    //     nutrientNameNormalized
    // )

    return (
        <>
            <section>
                <form action="" onChange={(e) => console.dir(e.currentTarget)}>
                    <fieldset className={styles.fieldset}>
                        {nutrientNames.map(
                            ([nutrientName, nutrientNameNormalized]) => {
                                return (
                                    <label
                                        key={nutrientName}
                                        className={styles.filterTab}
                                    >
                                        {getShowLoaderStatus(nutrientName) && (
                                            <Loader
                                                className={styles.spinner}
                                            />
                                        )}
                                        {nutrientNameNormalized}
                                        <input
                                            type="radio"
                                            checked={
                                                currentNutrient === nutrientName
                                            }
                                            name="nutrient"
                                            onChange={() =>
                                                !productsLoading &&
                                                setCurrentNutrient(nutrientName)
                                            }
                                            // disabled={productsLoading}
                                        />
                                    </label>
                                )
                            }
                        )}
                    </fieldset>
                </form>
            </section>

            <section>
                {/* {productsTier[currentNutrient]?.map((product) => { */}
                {currentProducts.map((product) => {
                    const { ['nutrient']: nutrientNames, ...productForList } =
                            product,
                        nutrient = product.nutrient
                    return (
                        <ListItem
                            key={product.id}
                            addProduct={addProductToSelected}
                            selectedProducts={selectedProducts}
                            item={productForList}
                            isLoading={false}
                        >
                            <div>
                                {currentNutrient && product && (
                                    <>
                                        <span>{nutrient.name}</span>
                                        <span>
                                            {getDailyNormPercent(
                                                nutrient.name,
                                                nutrient.value
                                            )}
                                            %
                                        </span>
                                        <span>
                                            {nutrient.value}
                                            {nutrient.unit}
                                        </span>
                                    </>
                                )}
                            </div>
                        </ListItem>
                    )
                })}
            </section>
        </>
    )
}

export default ProductsTier
