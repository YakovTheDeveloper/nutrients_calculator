declare namespace Nutrients {
    export interface Item {
        id: number
        product_id: number
        name: Name
        unit: string
        value: number
    }

    // rename table to nutrient or something
    export type TableItem = Pick<Item, 'name' | 'value' | 'unit'>
    export type item = Pick<Item, 'name' | 'value' | 'unit'>
    export type Items = item[]

    // export type TableItems = Record<string, TableItem>

    // export type NameNormalized = Partial<Record<keyof TableItems, string>>
    // export type NameNormalized = Partial<NamesToData<string>>
    export type NameNormalized = NamesToData<string>

    export type NamesToItems = NamesToData<TableItem>
    export type Name = keyof NamesToData<any>

    export interface NamesToData<T> {
        protein: T
        fat: T
        carbohydrate: T
        'vitamin a': T
        'beta carotene': T
        'alpha carotene': T
        'vitamin d': T
        'vitamin d2': T
        'vitamin d3': T
        'vitamin e': T
        'vitamin k': T
        'vitamin c': T
        'vitamin b1': T
        'vitamin b2': T
        'vitamin b3': T
        'vitamin b4': T
        'vitamin b5': T
        'vitamin b6': T
        'vitamin b9': T
        'vitamin b12': T
        calcium: T
        iron: T
        magnesium: T
        phosphorus: T
        potassium: T
        sodium: T
        zinc: T
        copper: T
        manganese: T
        selenium: T
        fluoride: T
        water: T
        fiber: T
        sugar: T
        energy: T
    }

    type Groups = {
        mainNutrients: TableItem[]
        misc: TableItem[]
        VitaminsNotB: TableItem[]
        vitaminsB: TableItem[]
        minerals: TableItem[]
    }

    // type Main = Array<Pick<NamesToData<TableItem>, 'protein' | 'fat' | 'carbohydrate' | 'fiber' | 'sugar'>>
    // type Misc = Pick<NamesToData<TableItem>, 'water' | 'energy' | 'beta carotene' | 'alpha carotene'>
    // type Minerals = Pick<NamesToData<TableItem>,
    //     'calcium' |
    //     'iron' |
    //     'magnesium' |
    //     'phosphorus' |
    //     'potassium' |
    //     'sodium' |
    //     'zinc' |
    //     'copper' |
    //     'manganese' |
    //     'selenium' |
    //     'fluoride'
    // >
    // type VitaminsB = Pick<NamesToData<TableItem>,
    //     'vitamin b1' |
    //     'vitamin b2' |
    //     'vitamin b3' |
    //     'vitamin b4' |
    //     'vitamin b5' |
    //     'vitamin b6' |
    //     'vitamin b9' |
    //     'vitamin b12'
    // >
    // type VitaminsNotB = Pick<NamesToData<TableItem>,
    //     'vitamin d' |
    //     'vitamin d2' |
    //     'vitamin d3' |
    //     'vitamin e' |
    //     'vitamin k' |
    //     'vitamin c'
    // >
}

declare namespace Api {
    export type Response<T> = {
        result: T
        detail?: string
    }
    export type urls = 'login/'

    export type Result<T> = {
        data: T
        hasError: boolean
        detail: string
    }

    export type User = {
        data: {
            email: string
        }
        token: string
    }

    export type UserToAuth = {
        email: string
        password: string
    }

    export type AddMenuResponse = Response<{
        menuId: number
    }>
    export type Menu = {
        id: number
        name: string
        description: string
        products: Products.Selected
        nutrients: Nutrients.NamesToItems
    }
}

declare namespace Products {
    type Id = number

    interface Item {
        id: Id
        name: string
        state: string
        category: string
        nutrients: Nutrients.NamesToItems
    }

    type ItemWithNoNutrients = Omit<Item, 'nutrients'>

    type ItemWithSingleNutrient = Omit<Item, 'nutrients'> & {
        nutrient: Nutrients.item
    }
    type ItemSelected = ItemWithNoNutrients & {
        quantity: number
        isLoading: boolean
    }

    // interface ItemSelected extends Item {
    //     quantity: number
    //     isLoading: boolean
    // }

    type Selected = Record<Id, ItemSelected>

    type IdToItemMapping = Record<Id, Item>
    type IdToLoadingMapping = Record<Id, boolean>

    interface Item {
        id: number
        name: string
        state: string
        category: string
    }

    interface Menu {
        id: number
        name: string
        description: string
        products: Products.Selected
        nutrients: Nutrients.NamesToItems
    }
}

declare namespace Menus {
    type Id = number
    export interface Item {
        id: number
        name: string
        description: string
        products: Products.Selected
        nutrients: Nutrients.NamesToItems
    }
    type IdToItemMapping = Record<Id, Item>
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
        quantity: number
    }
    type Id = number
    export type SelectedProducts = Record<Id, SelectedProduct>
}

declare namespace Form {
    type Items = {
        login: LoginForm
        signup: SignupForm
        addMenu: AddMenuForm
    }
    type LoginForm = {
        email: string
        password: string
    }

    type SignupForm = {
        email: string
        password: string
    }

    type AddMenuForm = Record<
        keyof Pick<Products.Menu, 'name' | 'description'>,
        string
    >

    type InputNames<T> = Record<keyof T, keyof T>

    // type Types = Items[keyof Items]
    type Types = Items[keyof Items]
    type Names = keyof Items
}
