import { fetchNutrientCalculation, fetchProductListById } from '@api/methods'
import { useProductStore } from '@data/products'
import { calculateTotalNutrients } from '@helpers/calculateTotalNutrients'
import { isEmpty } from '@helpers/isEmpty'
import Button from '@ui/Button'
import SelectedProducts from '@ui/SelectedProducts'
import Table from '@ui/Table'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const ProductPage = () => {
    const { state } = useLocation()
    const [nutrients, setNutrients] = useState<Nutrients.NamesToItems | null>(
        null
    )
    const [quantity, setQuantity] = useState(100)
    const [loading, setLoading] = useState(true)
    const { addProduct, products } = useProductStore((state) => ({
        addProduct: state.addProduct,
        products: state.products,
    }))

    const product = state as Products.ItemSelected
    const productDataExist = Boolean(products[product.id])
    const idToProductMapping = {
        [product.id]: {
            ...product,
            quantity,
        },
    }

    const returnDefaultQuantity = () => setQuantity(100)

    const getProduct = async () => {
        setLoading(true)
        try {
            const data = await fetchProductListById({
                ids: product.id,
            })
            addProduct(data.result)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    // useEffect(() => {
    //     if (products[product.id]) {
    //         const totalNutrients = calculateTotalNutrients(
    //             idToProductWithDefaultQuantity,
    //             products
    //         )
    //         setNutrients(totalNutrients)
    //     }
    //     getProduct()
    // }, [])

    useEffect(() => {
        console.log('productDataExist', productDataExist)
        if (!productDataExist) return
        const totalNutrients = calculateTotalNutrients(
            idToProductMapping,
            products
        )
        setNutrients(totalNutrients)
    }, [quantity])

    useEffect(() => {
        if (!productDataExist) {
            getProduct()
            return
        }
        setLoading(false)
        const totalNutrients = calculateTotalNutrients(
            idToProductMapping,
            products
        )
        setNutrients(totalNutrients)
    }, [products])

    return (
        <div>
            <h2>{product.name}</h2>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <input
                        type="number"
                        min="0"
                        value={quantity.toString()}
                        onChange={(e) => {
                            if (e.target.value.length > 6) return
                            setQuantity(+e.target.value)
                        }}
                    />
                    <Button onClick={returnDefaultQuantity}>
                        back to default
                    </Button>
                    <Table data={nutrients} />
                </>
            )}
        </div>
    )
}

export default ProductPage
