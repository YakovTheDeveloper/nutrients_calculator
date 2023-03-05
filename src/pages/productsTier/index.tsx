import React, { useEffect, useState } from 'react'
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

const ProductsTier = () => {
    // fetchProductsByNutrient({ id: 'copper' })

    const { selectedProducts, addProductToSelected } = useProductStore(
        (state) => ({
            selectedProducts: state.selectedProducts,
            addProductToSelected: state.addProductToSelected,
        })
    )

    const [data, setData] = useState<Products.ItemWithSingleNutrient[]>([])
    const [currentNutrient, setCurrentNutrient] = useState<Nutrients.Name | ''>(
        'protein'
    )

    const nutrientNames = Object.entries(nutrientNameNormalized) as [
        Nutrients.Name,
        string
    ][]

    async function getProductsHandler(nutrient: Nutrients.Name) {
        const data = await fetchProductsByNutrient({ id: nutrient })
        setData(data.result)
    }

    useEffect(() => {
        console.log('@currentNutrient', currentNutrient)
        if (!currentNutrient) return
        const handler = setTimeout(
            () => getProductsHandler(currentNutrient),
            100
        )
        return () => clearTimeout(handler)
    }, [currentNutrient])

    return (
        <>
            <section>
                <form action="" onChange={(e) => console.dir(e.currentTarget)}>
                    <fieldset className={styles.fieldset}>
                        {nutrientNames.map(
                            ([nutrientName, nutrientNameNormalized]) => {
                                return (
                                    <label key={nutrientName}>
                                        {nutrientNameNormalized}
                                        <input
                                            type="radio"
                                            // value={nutrientName}
                                            checked={
                                                currentNutrient === nutrientName
                                            }
                                            name="nutrient"
                                            onChange={() =>
                                                setCurrentNutrient(nutrientName)
                                            }
                                        />
                                    </label>
                                )
                            }
                        )}
                    </fieldset>
                </form>
            </section>
            <section>
                {data.map((product) => {
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
