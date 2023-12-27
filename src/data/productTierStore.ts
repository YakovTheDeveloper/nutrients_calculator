import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type CurrentNutrient = {
	id: number;
	name: string;
} | null;

export interface SettingsState {
	currentNutrient: CurrentNutrient;
	setCurrentNutrient: (nutrient: CurrentNutrient) => void;
}

export const useProductTierStore = create<SettingsState>()(
	devtools(
		immer((set) => ({
			currentNutrient: null,
			setCurrentNutrient: (nutrient) =>
				set((state) => {
					state.currentNutrient = nutrient;
				}),
		})),
		{
			name: 'products-tier-storage',
		},
	),
);
