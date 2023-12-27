import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { DefaultNormsId } from '@constants/nutrients';

export enum SelectedProductsEnum {
	cards = 'cards',
	list = 'list',
}

type NutrientsSettings = {
	showNav: boolean;
	showHidden: boolean;
};

type CalcSettings = {
	currentNormId: string;
};

export interface SettingsState {
	selectedProductsSettings: {
		view: SelectedProductsEnum;
	};
	calcNutrientNorms: Norm.ItemInNormEditor[];
	nutrientsSettings: NutrientsSettings;
	calcSettings: CalcSettings;
	darkTheme: boolean;
	setSelectedProductsSettings: (view: SelectedProductsEnum) => void;
	//   setNutrientsSettings: (option: SetNutrientsSettings) => void;
	toggleNutrientsSettings: (setting: keyof NutrientsSettings) => void;
	setCalcNutrientNormId: (id: string) => void;
	setCalcNutrientNorms: (norm: Norm.Item[]) => void;
	toggleDarkTheme: () => void;
}

export const useSettings = create<SettingsState>()(
	devtools(
		immer((set, get) => ({
			darkTheme: true,
			calcNutrientNorms: [],
			selectedProductsSettings: {
				view: SelectedProductsEnum.cards,
			},
			nutrientsSettings: {
				showNav: true,
				showHidden: false,
			},
			calcSettings: {
				currentNormId: DefaultNormsId.Standard,
			},
			//   setNutrientsSettings: (option) =>
			//     set((state) => {
			//       if (option) state.nutrientsSettings[option.setting] = option.value;
			//     }),
			setCalcNutrientNorms: (norms) =>
				set(({ calcNutrientNorms }) => {
					calcNutrientNorms = norms;
				}),
			toggleNutrientsSettings: (setting) =>
				set(({ nutrientsSettings }) => {
					nutrientsSettings[setting] = !nutrientsSettings[setting];
				}),
			setSelectedProductsSettings: (view) =>
				set((state) => {
					state.selectedProductsSettings.view = view;
				}),
			setCalcNutrientNormId: (id) =>
				set(({ calcSettings }) => {
					calcSettings.currentNormId = id;
				}),
			toggleDarkTheme: () =>
				set((state) => {
					state.darkTheme = !state.darkTheme;
				}),
		})),
		{
			name: 'settings-storage',
		},
	),
);
