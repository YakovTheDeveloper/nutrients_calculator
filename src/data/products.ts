import { fetchProductListById, fetchProductsByNutrient } from '@api/methods'
import { findIdCrossings } from '@helpers/findIdCrossings'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export interface ProductState {
    products: Products.IdToItemMapping
    productsLoading: Products.IdToLoadingMapping
    productsTier: Products.Tiers
    addProductToTier: (product: Products.ItemWithSingleNutrient) => void
    fetchAndAddTierProducts: (
        nutrient: Nutrients.Name
    ) => Promise<Products.ItemWithSingleNutrient[] | null>
    selectedProducts: Products.Selected
    needToRecalculate: boolean
    setNeedToRecalculate: (status: boolean) => void
    //todo -> addProductGlobally
    addProduct: (productMapping: Products.IdToItemMapping) => void
    fetchSelectedProductsFullData: (
        products: Products.Selected
    ) => Promise<Products.IdToItemMapping | null>
    addProductToSelected: (product: Products.ItemSelected) => void
    setSelectedProductLoading: (id: Products.Id, status: boolean) => void
    clearSelectedProducts: () => void
    removeProductFromSelected: (product: Products.ItemSelected) => void
    setProductQuantity: (
        product: Products.ItemSelected,
        quantity: number
    ) => void
    totalNutrients: Nutrients.NamesToItems | null
    setTotalNutrients: (nutrients: Nutrients.NamesToItems) => void
    fetchAndAddProductToSelected: (product: Products.ItemSelected) => void
    clearTotalNutrients: () => void
}

export const useProductStore = create<ProductState>()(
    devtools(
        immer((set, get) => ({
            selectedProducts: {},
            products: {},
            productsLoading: {},
            productsTier: {},
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
            fetchSelectedProductsFullData: async (products) => {
                const idsAlreadyExist = Object.keys(get().products)
                const idsToAdd = Object.keys(products)
                const idsNeedToAdd = findIdCrossings(idsToAdd, idsAlreadyExist)
                console.log('idsNeedToAdd', idsNeedToAdd)
                try {
                    const response = await fetchProductListById({
                        ids: idsNeedToAdd.toString(),
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
            addProductToTier: (product) =>
                set((state) => ({
                    productsTier: {
                        ...state.productsTier,
                        [product.nutrient.name]: product,
                    },
                })),
            fetchAndAddTierProducts: async (nutrient) => {
                try {
                    const { result } = await fetchProductsByNutrient({
                        id: nutrient,
                    })
                    set((state) => ({
                        productsTier: {
                            ...state.productsTier,
                            [nutrient]: result,
                        },
                    }))
                    return result
                } catch (error) {
                    console.error(error)
                    return null
                }
            },
            addProductToSelected: (product) =>
                set((state) => ({
                    selectedProducts: {
                        ...state.selectedProducts,
                        [product.id]: { ...product, isLoading: true },
                    },
                })),
            fetchAndAddProductToSelected: async (product) => {
                const noNeedToFetch = Boolean(get().products[product.id])
                console.log('@@ noNeedToFetch', noNeedToFetch)
                set((state) => {
                    state.selectedProducts[product.id] = {
                        ...product,
                        isLoading: !noNeedToFetch,
                    }
                })

                if (noNeedToFetch === true) return

                try {
                    const { result } = await fetchProductListById({
                        ids: product.id,
                    })
                    set((state) => {
                        for (const id in result) {
                            state.products[id] = result[id]
                        }
                        state.selectedProducts[product.id].isLoading = false
                    })
                    return result
                } catch (error) {
                    console.error(error)
                    set((state) => {
                        delete state.selectedProducts[product.id]
                    })
                    return null
                }
            },
            setSelectedProductLoading: (id, status) =>
                set((state) => {
                    state.selectedProducts[id].isLoading = status
                }),
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
        })),
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
