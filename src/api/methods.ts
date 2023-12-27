import { PatchMenuConfig } from '@data/user';
import { addIdKeyPrefixToMapping } from '@helpers/normalizers';
import { sendRequest } from './sendRequest';

type ProductListParams = {
    name: string
}
type ProductListByIdParams = {
    food_id: number | number[]
}

type ProductByNutrient = {
    nutrient_id: number
}

//same
type GetUserProductsResponse = Record<string, {
    'name': string,
    'description': string[]
}>

type LoginOptions = {
    email: string
    password: string
}
type SignUpOptions = {
    email: string
    password: string
}

type CalculationParams = {
    [key: string]: number
}

type MenuDeleteOption = {
    id: number
}

//id1=100 & id2=200...
export type IdToValueMapping = {
    [key: number]: number
}

type AddMenuParams = {
    name: string
    description: string
    ids: IdToValueMapping
}

type GetNutrientsParams = {
    have_norms?: boolean
}

type PatchMenuParams = Partial<Products.Menu>
// type PatchMenuParams = Omit<PatchMenuConfig, 'newProducts'>

type ProductListResponse = Products.ItemWithNoNutrients[]

type AuthResponse = {
    email: string
    token: string
}
type MeResponse = {
    email: string
}
type UserMenuResponse = Products.Menu[]

type NutrientsResponse = Nutrients.Item[]

type AddMenuResponse = {
    menuId: number
}

export function fetchProductList(options: ProductListParams) {
    return sendRequest<ProductListResponse>({
        url: 'products/minimal/',
        method: 'GET',
        query: options
    });
}

export function fetchLogin(options: LoginOptions) {
    return sendRequest<AuthResponse>({
        url: 'auth/login/',
        method: 'POST',
        payload: options
    });
}

export function fetchSignup(options: SignUpOptions) {
    return sendRequest<AuthResponse>({
        url: 'auth/signup/',
        method: 'POST',
        payload: options
    });
}

export function fetchMe() {
    return sendRequest<MeResponse>({
        url: 'user/me/',
        method: 'GET'
    });
}

export function fetchProductListById(options: ProductListByIdParams) {
    // if(options.food_id instanceof Array)
    options.food_id = options.food_id.toString();
    return sendRequest<Products.IdToItemMapping>({
        url: 'products/with_nutrients/',
        method: 'GET',
        query: options
    });
}


export function fetchProductsByNutrient(options: ProductByNutrient) {
    return sendRequest<(Products.ItemWithNoNutrients & { amount: number })[]>({
        url: 'products/rich',
        query: options,
        method: 'GET'
    });
}

export function fetchNutrientCalculation(options: CalculationParams) {
    return sendRequest<Nutrients.NamesToItems>({
        url: 'polls/calculate_nutrients/',
        method: 'GET',
        query: addIdKeyPrefixToMapping(options)
    });
}

export function fetchMenuDelete(options: MenuDeleteOption) {
    return sendRequest<null>({
        url: `menu/${options.id}/`,
        method: 'DELETE'
    });
}

export function fetchUserMenus() {
    return sendRequest<UserMenuResponse>({
        url: 'menu/',
        method: 'GET'
    });
}

export function fetchAddUserMenu(options: AddMenuParams) {
    const { description, name, ids: products } = options;
    console.log('options', options);
    return sendRequest<AddMenuResponse>({
        url: 'menu/',
        method: 'POST',
        payload: {
            name,
            description,
            products
        }
        // query: {
        //     description,
        //     name,
        //     ...addIdKeyPrefixToMapping(ids),
        // },
    });
}

export function fetchPatchUserMenu(menuId: number, options: PatchMenuParams) {
    return sendRequest<null>({
        url: `menu/${menuId}/`,
        method: 'PATCH',
        payload: options
    });
}

export function fetchNutrients(options: GetNutrientsParams) {
    return sendRequest<NutrientsResponse>({
        url: 'nutrients',
        method: 'GET',
        query: options
    });
}

export function fetchGetUserProducts() {
    return sendRequest<GetUserProductsResponse>({
        url: 'user/products'
    });
}

export function fetchCreateProduct(payload: Products.Api.Payload.Create) {
    return sendRequest<Products.Api.Response.Create>({
        url: 'products',
        method: 'POST',
        payload: payload
    });
}

export function fetchDeleteProduct(id: number) {
    return sendRequest<Products.Api.Response.Create>({
        url: `products/${id}`,
        method: 'DELETE'
    });
}

export function fetchGetNorms() {
    return sendRequest<Norm.Api.Get>({
        url: 'norms'
    });
}

export function fetchAddNorm(payload: Norm.Api.Add) {
    return sendRequest<Norm.Api.Response.Add>({
        url: 'norms',
        method: 'POST',
        payload
    });
}

export function fetchPatchNorm(payload: Norm.Api.Add) {
    return sendRequest<Norm.Api.Get>({
        url: 'norms',
        method: 'PATCH',
        payload
    });
}

export function fetchDeleteNorm(id: number) {
    return sendRequest<Norm.Api.Get>({
        url: `norms/${id}`,
        method: 'DELETE',
    });
}

// export function fetchPatchUserMenu(menuId: number, options: PatchMenuParams) {
//     //todo: remove id from config
//     const { idToQuantityMapping, id, ...rest } = options
//     const ids = idToQuantityMapping
//         ? addIdKeyPrefixToMapping(idToQuantityMapping)
//         : {}
//     console.log('config', { ...rest })

//     return sendRequest<null>({
//         url: `products/menu/${menuId}/`,
//         method: 'PATCH',
//         query: { ...ids, ...rest },
//     })
// }

// const token = data.result?.token
// token && setToken(token)
