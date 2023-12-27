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
    totalNutrients: Nutrients.IdToItem;
    setTotalNutrients: (nutrients: Nutrients.IdToItem) => void;
    clearTotalNutrients: () => void;

    nutrientVisibilityMapping: VisibilityMapping;
    toggleNutrientVisibility: (nutrientId: number) => void;
    isNutrientHidden: (nutrientId: number) => boolean;

    allDefaultNutrients: Nutrients.Item[];
    setAllDefaultNutrients: (nutrients: Nutrients.Item[]) => void;
    hasDefaultNutrients: () => boolean;

    allDefaultNutrientsFromNorm: Nutrients.Item[];
    setAllDefaultNutrientsFromNorm: (nutrients: Nutrients.Item[]) => void;
    hasDefaultNutrientsFromNorm: () => boolean;
}


export const useNutrientsStore = create<NutrientsState>()(
    devtools(
        immer((set, get) => ({
            allDefaultNutrients: [],
            setAllDefaultNutrients: (nutrients) =>
                set((state) => {
                    state.allDefaultNutrients = nutrients;
                }),
            hasDefaultNutrients: () =>
                get().allDefaultNutrients.length > 0,
            allDefaultNutrientsFromNorm: [],
            setAllDefaultNutrientsFromNorm: (nutrients) =>
                set((state) => {
                    state.allDefaultNutrientsFromNorm = nutrients;
                }),
            hasDefaultNutrientsFromNorm: () =>
                get().allDefaultNutrientsFromNorm.length > 0,
            totalNutrients: {},
            nutrientVisibilityMapping: {},
            toggleNutrientVisibility: (nutrientId) =>
                set(({ nutrientVisibilityMapping }) => {
                    const inMapping = nutrientId in nutrientVisibilityMapping;
                    if (inMapping) {
                        nutrientVisibilityMapping[nutrientId] =
                            !nutrientVisibilityMapping[nutrientId];
                    } else nutrientVisibilityMapping[nutrientId] = false;
                }),
            setTotalNutrients: (nutrients) =>
                set(() => {
                    return {
                        totalNutrients: nutrients
                    };
                }),
            clearTotalNutrients: () =>
                set(() => {
                    return {
                        totalNutrients: {}
                    };
                }),
            isNutrientHidden: (nutrientId) => {
                const mapping = get().nutrientVisibilityMapping;
                if (nutrientId in mapping) {
                    return !mapping[nutrientId];
                }
                return false;
            }
        })),
        {
            name: 'nutrient-storage'
        }
    )
);

export const getHidenNutrients = (mapping: VisibilityMapping) => {
    const hiden: string[] = [];
    for (const key in mapping){
        if(mapping[key]) continue;
        hiden.push(key);
    }
    return hiden;
};

export const getNutrientsByGroups = (data: Nutrients.Item[]) => {
    const groups: Nutrients.Groups<Nutrients.GroupData> = {
        primary: {
            name: 'Primary',
            label: 'Primary',
            content: []
        },
        carbohydrate: {
            name: 'Carbohydrates',
            label: 'Carbs',
            content: []
        },
        mineral: {
            name: 'Minerals',
            label: 'Minerals',
            content: []
        },
        vitamin_b: {
            name: 'Vitamins B',
            label: 'B',
            content: []
        },
        vitamin_rest: {
            name: 'Vitamins rest',
            label: 'Vitamins rest',
            content: []
        },
        aminoacid: {
            name: 'Amino acids',
            label: 'Amino acids',
            content: []
        },
        rest: {
            name: 'Other Components',
            label: 'Other',
            content: []
        }
    };

    for (const nutrient of data) {
        let groupName = nutrient.group_name;
        if (!groupName) groupName = 'rest';

        groups[groupName].content.push(nutrient);
    }

    return groups;
};