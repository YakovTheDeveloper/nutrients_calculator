import { fetchProductListById } from '@api/methods'
import { findIdCrossings } from '@helpers/findIdCrossings'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export interface ProductState {
    products: Products.IdToItemMapping
    productsLoading: Products.IdToLoadingMapping
    selectedProducts: Products.Selected
    needToRecalculate: boolean
    setNeedToRecalculate: (status: boolean) => void
    //todo -> addProductGlobally
    addProduct: (productMapping: Products.IdToItemMapping) => void
    fetchSelectedProductsFullData: (
        products: Products.Selected
    ) => Promise<Products.IdToItemMapping | null>
    addProductToSelected: (product: Products.ItemSelected) => void
    clearSelectedProducts: () => void
    removeProductFromSelected: (product: Products.ItemSelected) => void
    setProductQuantity: (
        product: Products.ItemSelected,
        quantity: number
    ) => void
    totalNutrients: Nutrients.NamesToItems | null
    setTotalNutrients: (nutrients: Nutrients.NamesToItems) => void
    clearTotalNutrients: () => void
}

export const useProductStore = create<ProductState>()(
    devtools(
        (set, get) => ({
            selectedProducts: {},
            products: {},
            productsLoading: {},
            IdToLoadingMapping: {},
            totalNutrients: null,
            needToRecalculate: false,
            addProduct: (productMapping) =>
                set((state) => ({
                    products: {
                        ...state.products,
                        ...productMapping,
                    },
                })),
            fetchSelectedProductsFullData: async (
                products: Products.Selected
            ) => {
                const idsAlreadyExist = Object.keys(get().products)
                const idsToAdd = Object.keys(products)
                const idsNeedToAdd = findIdCrossings(idsToAdd, idsAlreadyExist)
                console.log('idsNeedToAdd', idsNeedToAdd)
                try {
                    const response = await fetchProductListById({
                        ids: idsToAdd.toString(),
                    })
                    set((state) => ({
                        products: {
                            ...state.products,
                            ...response.result,
                        },
                    }))
                    return response.result
                } catch (error) {
                    console.error(error)
                    return null
                }
            },
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

export function getProductsById(ids: string[], products: Products.Selected) {
    const productsById: Products.Selected = {}
    ids.forEach((id) => (productsById[+id] = products[+id]))
    return productsById
}
