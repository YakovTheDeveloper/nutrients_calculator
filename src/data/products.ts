import { fetchProductListById, fetchProductsByNutrient } from '@api/methods';
import { findIdCrossings } from '@helpers/findIdCrossings';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import data from './initProducts.json';


export interface ProductState {
    products: Products.IdToItemMapping;
    productsLoading: Products.IdToLoadingMapping;
    selectedProducts: Products.Selected2;
    needToRecalculate: boolean;
    setNeedToRecalculate: (status: boolean) => void;
    //todo -> addProductGlobally
    addProduct: (productMapping: Products.IdToItemMapping) => void;
    fetchSelectedProductsFullData: (
        products: Products.Selected2
    ) => Promise<Products.IdToItemMapping | null>;
    addProductToSelected: (product: Products.ItemSelected) => void;
    setSelectedProducts: (product: Products.Selected2) => void;
    setSelectedProductLoading: (id: Products.Id, status: boolean) => void;
    clearSelectedProducts: () => void;
    removeProductFromSelected: (product: Products.ItemSelected) => void;
    totalNutrients: Nutrients.NamesToItems | null;
    setTotalNutrients: (nutrients: Nutrients.NamesToItems) => void;
    clearTotalNutrients: () => void;
}

export const useProductStore = create<ProductState>()(
    devtools(
        immer((set, get) => ({
            selectedProducts: {},
            products: data,
            productsLoading: {},
            // productsTier: {},
            IdToLoadingMapping: {},
            totalNutrients: null,
            needToRecalculate: false,
            addProduct: (productMapping) =>
                set((state) => ({
                    products: {
                        ...state.products,
                        ...productMapping
                    }
                })),
            fetchSelectedProductsFullData: async (products) => {
                const idsAlreadyExist = Object.keys(get().products);
                const idsToAdd = Object.keys(products);
                const idsNeedToAdd = findIdCrossings(idsToAdd, idsAlreadyExist);

                // console.log('@@idsAlreadyExist',idsAlreadyExist);
                // console.log('@@idsAlreadyExist',idsToAdd);
                // console.log('@@idsAlreadyExist',idsNeedToAdd);

                if (idsNeedToAdd.length === 0) return null;

                try {
                    const response = await fetchProductListById({
                        food_id: idsNeedToAdd
                    });
                    set((state) => ({
                        products: {
                            ...state.products,
                            ...response.result
                        }
                    }));
                    return response.result;
                } catch (error) {
                    console.error(error);
                    return null;
                }
            },
            // addProductToTier: (product) =>
            //   set((state) => ({
            //     productsTier: {
            //       ...state.productsTier,
            //       [product.nutrient.name]: product,
            //     },
            //   })),
            // fetchAndAddTierProducts: async (nutrient) => {
            //   try {
            //     const { result } = await fetchProductsByNutrient({
            //       id: nutrient,
            //     });
            //     set((state) => ({
            //       productsTier: {
            //         ...state.productsTier,
            //         [nutrient]: result,
            //       },
            //     }));
            //     return result;
            //   } catch (error) {
            //     console.error(error);
            //     return null;
            //   }
            // },
            addProductToSelected: (product) =>
                set((state) => ({
                    selectedProducts: {
                        ...state.selectedProducts,
                        [product.id]: { ...product, isLoading: true }
                    }
                })),
            setSelectedProducts: (products) =>
                set((state) => {
                    state.selectedProducts = products;
                }),
            setSelectedProductLoading: (id, status) =>
                set((state) => {
                    state.selectedProducts[id].isLoading = status;
                }),
            clearSelectedProducts: () =>
                set((state) => ({
                    selectedProducts: {}
                })),
            removeProductFromSelected: (product) =>
                set((state) => {
                    const { [product.id]: value, ...rest } = state.selectedProducts;
                    return { selectedProducts: { ...rest } };
                }),
            setNeedToRecalculate: (status) =>
                set((state) => ({
                    needToRecalculate: status
                })),
            setTotalNutrients: (nutrients) =>
                set((state) => {
                    return {
                        totalNutrients: nutrients
                    };
                }),
            clearTotalNutrients: () =>
                set(() => {
                    return {
                        totalNutrients: null
                    };
                })
        })),
        {
            name: 'product-storage'
        }
    )
);

export function getProductsById(ids: string[], products: Products.Selected) {
    const productsById: Products.Selected = {};
    ids.forEach((id) => (productsById[+id] = products[+id]));
    return productsById;
}

// export function createIdToItemMapping(items: Products.Item[]){
//     const result: Record<string,Products.Item> = {};
//     items.forEach(item => result[item.id] = item);
//     return result;
// }


// console.log('data',data);