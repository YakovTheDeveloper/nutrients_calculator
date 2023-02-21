declare namespace Nutrients {
    export interface Item {
        id: number
        product_id: number
        name: Name
        unit: string
        value: number
    }

    export type TableItem = Pick<Item, 'name' | 'value' | 'unit'>
    // export type TableItems = Record<string, TableItem>

    // export type NameNormalized = Partial<Record<keyof TableItems, string>>
    export type NameNormalized = Partial<NamesToData<string>>

    export type NamesToItems = NamesToData<TableItem>
    export type Name = keyof NamesToItems

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
    }
    export type urls = 'login/'

    export type Result = {
        result: any
        isError: boolean
        reason: string
    }

    export type User = {
        user: {
            email: string
        }
        token: string
    }

    export type UserToAuth = {
        email: string
        password: string | null
    }
}

declare namespace Products {
    type Id = number
    export interface Item {
        id: number
        name: string
        state: string
        category: string
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
        quantity: number
    }
    type Id = number
    export type SelectedProducts = Record<Id, SelectedProduct>
}

declare namespace Form {
    type Items = {
        login: LoginForm
        signup: SignupForm
    }
    type LoginForm = {
        email: ''
        password: ''
    }

    type SignupForm = {
        email: ''
        password: ''
    }

    type InputNames<T> = Record<keyof T, keyof T>

    type Types = Items[keyof Items]
}
