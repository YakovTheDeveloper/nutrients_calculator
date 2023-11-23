import { SelectedProduct } from "./../types/index.d";
import { removeToken } from "@api/localStorage";
import { IdToValueMapping } from "@api/methods";
import { ReactNode } from "react";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { isEmpty } from "@helpers/isEmpty";
import { immer } from "zustand/middleware/immer";

export interface State {
    description: Omit<Products.Item, "id" | "nutrients">;
    nutrientsToAmountMapping: Record<string, number>;
}

type CreateProduct = {
    name: string,
    description: string,
    category: string,
    nutrients: Record<string, number>,
}

export interface Actions {
    setDescription: (key: keyof State["description"], value: string) => void;
    setNutrientsToAmountMapping: (id: string, value: number) => void;
    reset: () => void;
    toServerFormat: () => CreateProduct;
}


const initialState: State = {
    description: {
        name: "",
        description: ""
    },
    nutrientsToAmountMapping: {}
};

export const useCreateProductStore = create<Actions & State>()(
    devtools(
        immer((set, get) => ({
            ...initialState,

            setDescription: (key, value) =>
                set((state) => {
                    state.description[key] = value;
                }),
            setNutrientsToAmountMapping: (id, value) =>
                set((state) => {
                    if (!value && (id in state.nutrientsToAmountMapping)) {
                        delete state.nutrientsToAmountMapping[id];
                        return;
                    }
                    state.nutrientsToAmountMapping[id] = value;
                }),
            reset: () =>
                set((state) => {
                    state.description = initialState.description;
                    state.nutrientsToAmountMapping = initialState.nutrientsToAmountMapping;
                }),
            toServerFormat: () => {
                const { name, description } = get().description;
                const nutrients = get().nutrientsToAmountMapping;
                return {
                    name,
                    description,
                    category: "",
                    nutrients
                };
            }

        })),
        {
            name: "create-product-storage",
            serialize: {
                options: {
                    map: true
                }
            } as any
        }
    )
);
