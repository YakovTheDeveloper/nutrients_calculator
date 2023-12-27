import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { nutrientDailyNormCode, NutrientsNorm,nutrientDailyNormSport } from '@constants/nutrients';

type VisibilityMapping = Record<string, boolean>

// parseInt using on uuid is always returns NaN 
export const isJustCreatedNorm = (id: string) => {
    return isNaN(parseInt(id));
};

export interface NutrientsState {
    nutrientNorms: Norm.Item[];
    // setNutrientNorms: (norms: Norm.Item[]) => void;
    addNutrientNorm: (norm: Norm.Item | Norm.Item[]) => void;
    deleteNutrientNorm: (id: string) => void;
    patchNutrientNorm: (newNorm: Norm.ItemInNormEditor) => void;
    patchNutrientNormId: (oldId: string, newId: number) => void;
}


export const useNutrientNormsStore = create<NutrientsState>()(
    devtools(
        immer((set, get) => ({
            nutrientNorms: [
                nutrientDailyNormCode,
                nutrientDailyNormSport
            ],
            // setNutrientNorms: (norms) =>
            //     set(({ nutrientNorms }) => {
            //         nutrientNorms = [nutrientDailyNormCode, ...norms];
            //     }),
            addNutrientNorm: (norm) =>
                set((state) => {
                    if(norm instanceof Array){
                        state.nutrientNorms = [...state.nutrientNorms, ...norm];
                        return;
                    }
                    state.nutrientNorms.push(norm);
                }
                ),
            deleteNutrientNorm: (id) =>
                set((state) => {
                    state.nutrientNorms = state.nutrientNorms.filter(norm =>norm.id !== id);
                }
                ),
            patchNutrientNorm: (newNorm) =>
                set((state) => {
                    state.nutrientNorms = state.nutrientNorms.map(norm =>{
                        if(norm.id !== newNorm.id) return norm;
                        return newNorm;
                    });
                }
                ),
            patchNutrientNormId: (oldId, newId) =>
                set((state) => {
                    state.nutrientNorms = state.nutrientNorms.map(norm =>{
                        if(norm.id !== oldId) return norm;
                        return {
                            ...norm,
                            id: newId
                        };
                    });
                }
                ),
        })),
        {
            name: 'norms-storage'
        }
    )
);
