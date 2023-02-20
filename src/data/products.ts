import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface ProductState {
    selectedProducts: Data.SelectedProducts
    addProductToSelected: (product: Data.SelectedProduct) => void
    removeProductFromSelected: (product: Data.SelectedProduct) => void
    setProductQuantity: (product: Data.SelectedProduct, quantity: number) => void
}

export const useProductStore = create<ProductState>()(
    devtools(
        (set) => ({
            selectedProducts: [],
            addProductToSelected: (product) => set((state) => ({
                selectedProducts: {
                    ...state.selectedProducts,
                    [product.id]: product,
                }
            })),
            removeProductFromSelected: (product) => set((state) => {
                const { [product.id]: value, ...rest } = state.selectedProducts
                return { selectedProducts: { ...rest } }
            }),
            setProductQuantity: (product, quantity) => set((state) => {
                console.log(`${product.id} ${quantity} `)
                return {
                    selectedProducts: {
                        ...state.selectedProducts,
                        [product.id]: {
                            ...state.selectedProducts[product.id],
                            quantity
                        },
                    }
                }

            })
        }),
        {
            name: 'product-storage',
        }
    )
)