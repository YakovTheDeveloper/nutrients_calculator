import { SelectedProduct } from "./../types/index.d";
import { removeToken } from "@api/localStorage";
import { IdToValueMapping } from "@api/methods";
import { ReactNode } from "react";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { isEmpty } from "@helpers/isEmpty";
import { immer } from "zustand/middleware/immer";
import { productIdToNameAndDescriptionMapping } from "@constants/products";
import { objectEntries } from "@helpers/objectEntries";

type Product = Readonly<{
    "name": string,
    "description": string[]
}>

type ProductsMapping = Record<string, Product>


export interface State {
    baseProductsMinimal: ProductsMapping;
    userProductsMinimal: ProductsMapping;
}

export interface Actions {
    setUserProductsMinimal: (products: ProductsMapping) => void;
    addToUserProductsMinimal: (products: {
        id: number,
        name: string
        description: string,
    }) => void;
    deleteFromUserProductsMinimal: (id: number) => void;
    getMixedProductsMinimal: () => ProductsMapping;
    getProductMinimalData: (id: string) => Product | null;
    getUserProductsMinimal: (how: "mapping" | "array") => any;
}


const initialState: State = {
    baseProductsMinimal: Object.freeze(productIdToNameAndDescriptionMapping),
    userProductsMinimal: {}
};

export const useBaseProducts = create<Actions & State>()(
    devtools(
        immer((set, get) => ({
            ...initialState,
            getUserProductsMinimal: (how) => {
                if (how === "array") return objectEntries(get().userProductsMinimal)
                    .map(([id, products]) => ({ id, ...products }));
                return get().userProductsMinimal;
            },
            setUserProductsMinimal: (products) =>
                set((state) => {
                    state.userProductsMinimal = products;
                }),
            addToUserProductsMinimal: (product) =>
                set((state) => {
                    const { id, ...prod } = product;
                    state.userProductsMinimal[id] = prod;
                }),
            deleteFromUserProductsMinimal: (id: number) =>
                set((state) => {
                    console.log(state.userProductsMinimal, id)

                    // delete state.userProductsMinimal[id];
                    delete state.userProductsMinimal[id];
                }),
            getMixedProductsMinimal: () => {
                return {
                    ...get().baseProductsMinimal,
                    ...get().userProductsMinimal
                };
            },
            getProductMinimalData: (id) => {
                const { baseProductsMinimal, userProductsMinimal } = get();
                if (id in baseProductsMinimal) return baseProductsMinimal[id];
                if (id in userProductsMinimal) return userProductsMinimal[id];
                return null;
            }

        })),
        {
            name: "base-products-storage"

        }
    )
);
