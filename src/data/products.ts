import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface ProductState {
    products: Products.IdToItemMapping
    selectedProducts: Data.SelectedProducts
    needToRecalculate: boolean
    setNeedToRecalculate: (status: boolean) => void
    addProduct: (productMapping: Products.IdToItemMapping) => void
    addProductToSelected: (product: Data.SelectedProduct) => void
    clearSelectedProducts: () => void
    removeProductFromSelected: (product: Data.SelectedProduct) => void
    setProductQuantity: (
        product: Data.SelectedProduct,
        quantity: number
    ) => void
    totalNutrients: Nutrients.NamesToItems | null
    setTotalNutrients: (nutrients: Nutrients.NamesToItems) => void
    clearTotalNutrients: () => void
}


export const useProductStore = create<ProductState>()(
    devtools(
        (set) => ({
            selectedProducts: {},
            products: {},
            totalNutrients: null,
            needToRecalculate: false,
            addProduct: (productMapping) =>
                set((state) => ({
                    products: {
                        ...state.products,
                        ...productMapping,
                    },
                })),
            addProductToSelected: (product) =>
                set((state) => ({
                    selectedProducts: {
                        ...state.selectedProducts,
                        [product.id]: product,
                    },
                })),
            clearSelectedProducts: () =>
                set((state) => ({
                    selectedProducts: {},
                })),
            removeProductFromSelected: (product) =>
                set((state) => {
                    const { [product.id]: value, ...rest } =
                        state.selectedProducts
                    return { selectedProducts: { ...rest } }
                }),
            setProductQuantity: (product, quantity) =>
                set((state) => {
                    console.log(`${product.id} ${quantity} `)
                    return {
                        selectedProducts: {
                            ...state.selectedProducts,
                            [product.id]: {
                                ...state.selectedProducts[product.id],
                                quantity,
                            },
                        },
                    }
                }),
            setNeedToRecalculate: (status) =>
                set((state) => ({
                    needToRecalculate: status,
                })),
            setTotalNutrients: (nutrients) =>
                set((state) => {
                    return {
                        totalNutrients: nutrients,
                    }
                }),
            clearTotalNutrients: () =>
                set(() => {
                    return {
                        totalNutrients: null,
                    }
                }),
        }),
        {
            name: 'product-storage',
        }
    )
)
