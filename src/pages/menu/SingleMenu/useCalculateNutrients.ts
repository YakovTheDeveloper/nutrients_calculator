import { MenuReducerState } from './useMenuControls'
import { SelectedProduct } from '../../../types/declaration'
import { findIdCrossings } from '@helpers/findIdCrossings'
import { useState, useEffect } from 'react'
import { SingleMenuProps } from '../index'
import { calculateTotalNutrients } from '@helpers/calculateTotalNutrients'
import { deepCopy } from '@helpers/deepCopy'

type useCalculateNutrientsProps = {
    menu: SingleMenuProps['menu']
    products: SingleMenuProps['products']
    selectedProducts: Products.Selected
    controlsState: MenuReducerState
    // products: SingleMenuProps['products']

    // fetchSelectedProductsFullData: SingleMenuProps['fetchSelectedProductsFullData']
}

export const useCalculateNutrients = ({
    menu,
    products,
    selectedProducts,
    controlsState,
}: useCalculateNutrientsProps) => {
    const [totalNutrients, setTotalNutrients] = useState(() =>
        deepCopy<Nutrients.NamesToItems>(menu.nutrients)
    )

    useEffect(() => {
        if (!controlsState.editMode) {
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
    }, [selectedProducts, controlsState.editMode, products])

    return {
        totalNutrients,
    }
}
