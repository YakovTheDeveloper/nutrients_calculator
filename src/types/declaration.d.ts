declare namespace Norm {
	// todo handle duplicates
	export enum NutrientCodes {
		Protein = 203,
		Fat = 204,
		Carbohydrate = 205,
		VitaminA = 320,
		BetaCarotene = 321,
		AlphaCarotene = 322,
		VitaminD = 328,
		VitaminD2 = 325,
		VitaminD3 = 326,
		VitaminE = 394,
		VitaminK = 428,
		VitaminC = 401,
		VitaminB1 = 404,
		VitaminB2 = 405,
		VitaminB3 = 406,
		VitaminB4 = 421,
		VitaminB5 = 410,
		VitaminB6 = 415,
		VitaminB9 = 417,
		VitaminB12 = 418,
		Calcium = 301,
		Iron = 303,
		Magnesium = 304,
		Phosphorus = 305,
		Potassium = 306,
		Sodium = 307,
		Zinc = 309,
		Copper = 312,
		Manganese = 315,
		Selenium = 317,
		Fluoride = 313,
		Water = 255,
		Fiber = 291,
		Sugar = 269,
		Energy = 1200,
	}

	type Id = string;

	type Item = {
		id: string;
		name: string;
		norm: Record<NutrientCodes, number>;
	};

	type ItemInNormEditor = Item & { isDraft?: boolean };

	namespace Api {
		type Get = Item;
		type Add = Omit<Item, 'id'>;

		namespace Response {
			type Add = Item & { id: number };
		}
	}
}

declare namespace Nutrients {
	// export interface Item {
	//     id: number
	//     product_id: number
	//     name: Name
	//     unit: string
	//     value: number
	// }

	export type Groups<T = unknown> = {
		primary: T;
		carbohydrate: T;
		mineral: T;
		vitamin_b: T;
		vitamin_rest: T;
		aminoacid: T;
		rest: T;
	};

	export type GroupNames = keyof Groups;

	export type GroupData = {
		name: string;
		label: string;
		content: Nutrients.Item[];
	};

	export interface Item {
		id: number;
		name: string;
		amount: number;
		unit: 'G' | 'UG' | 'KCAL' | 'MG';
		code: number;
		group_name: GroupNames | null;
	}

	export interface IdToItem {
		[key: number]: Nutrients.Item;
	}

	// rename table to nutrient or something
	export type TableItem = Pick<Item, 'name' | 'value' | 'unit'>;
	export type item = Pick<Item, 'name' | 'value' | 'unit'>;
	export type Items = item[];

	// export type TableItems = Record<string, TableItem>

	// export type NameNormalized = Partial<Record<keyof TableItems, string>>
	// export type NameNormalized = Partial<NamesToData<string>>
	export type NameNormalized = NamesToData<string>;

	export type NamesToItems = NamesToData<item>;
	export type Name = keyof NamesToData<unknown>;

	export interface NamesToData<T> {
		protein: T;
		fat: T;
		carbohydrate: T;
		'vitamin a': T;
		'beta carotene': T;
		'alpha carotene': T;
		'vitamin d': T;
		'vitamin d2': T;
		'vitamin d3': T;
		'vitamin e': T;
		'vitamin k': T;
		'vitamin c': T;
		'vitamin b1': T;
		'vitamin b2': T;
		'vitamin b3': T;
		'vitamin b4': T;
		'vitamin b5': T;
		'vitamin b6': T;
		'vitamin b9': T;
		'vitamin b12': T;
		calcium: T;
		iron: T;
		magnesium: T;
		phosphorus: T;
		potassium: T;
		sodium: T;
		zinc: T;
		copper: T;
		manganese: T;
		selenium: T;
		fluoride: T;
		water: T;
		fiber: T;
		sugar: T;
		energy: T;
	}
}

declare namespace Api {
	export type Response<T> = {
		result: T;
		detail?: string;
	};
	export type urls = 'login/';

	export type Result<T> = {
		data: T;
		hasError: boolean;
		detail: string;
	};

	export type User = {
		data: {
			email: string;
		};
		token: string;
	};

	export type Menu = {
		id: number;
		name: string;
		description: string;
		products: Products.Selected;
		nutrients: Nutrients.NamesToItems;
	};
}

declare namespace Products {
	namespace Api {
		namespace Response {
			interface Create {
				id: number;
				name: string;
				description: string;
				category: string;
				nutrients: Record<Id, Quantity>;
			}
		}

		namespace Payload {
			interface Create {
				name: string;
				description: string;
				category: string;
				nutrients: Record<Id, Quantity>;
			}
		}

		namespace Params {}
	}

	type Id = number;

	type IdToValueMapping = {
		[id: number]: Item;
	};

	interface Item {
		id: Id;
		name: string;
		description: string;
		nutrients: Nutrients.Item[];
	}

	type ItemWithNoNutrients = Omit<Item, 'nutrients'>;

	type ItemWithSingleNutrient = Omit<Item, 'nutrients'> & {
		nutrient: Nutrients.item;
	};

	type Tiers = Partial<Record<Nutrients.Name, ItemWithSingleNutrient[]>>;

	type ItemSelected = ItemWithNoNutrients & {
		quantity: number;
		isLoading: boolean;
	};

	type Selected = Record<Id, ItemSelected>;

	type Quantity = number;
	type Selected2 = Record<Id, Quantity>;

	type IdToItemMapping = Record<Id, Item>;
	type IdToLoadingMapping = Record<Id, boolean>;

	interface Menu {
		id: number;
		name: string;
		description: string;
		products: Selected2;
	}
}

declare namespace Menus {
	export interface Item {
		id: number;
		name: string;
		description: string;
		products: Products.Selected;
		nutrients: Nutrients.NamesToItems;
	}

	export interface Update {
		id: number;
		name: string;
		description: string;
		products: Products.Selected;
		nutrients: Nutrients.NamesToItems;
	}
}

// declare namespace User {
//     export interface Products {
//         'id': number,
//         'name': string,
//         'state': string,
//         'category': string
//     }
// }

declare namespace Data {
	export interface SelectedProduct extends Products.Item {
		quantity: number;
	}

	type Id = number;
	export type SelectedProducts = Record<Id, SelectedProduct>;
}

declare namespace Form {
	type Items = {
		login: LoginForm;
		signup: SignupForm;
		addMenu: AddMenuForm;
	};
	type LoginForm = {
		email: string;
		password: string;
	};

	type SignupForm = {
		email: string;
		password: string;
	};

	type MenuAdd = {
		name: string;
		description: string;
	};

	type AddMenuForm = Record<keyof Pick<Products.Menu, 'name' | 'description'>, string>;

	type InputNames<T> = Record<keyof T, keyof T>;

	// type Types = Items[keyof Items]
	type Types = Items[keyof Items];
	type Names = keyof Items;
}
