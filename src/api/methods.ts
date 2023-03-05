import { addIdKeyPrefixToMapping } from '@helpers/normalizers'
import { sendRequest } from './sendRequest'

type ProductListParams = {
    name: string
}
type ProductListByIdParams = {
    ids: string | number
}

type ProductByNutrient = {
    id: Nutrients.Name
}

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

type addMenuParams = {
    name: string
    description: string
    ids: IdToValueMapping
}

type patchMenuParams = IdToValueMapping

type ProductListResponse = Products.Item[]

type AuthResponse = {
    email: string
    token: string
}
type MeResponse = {
    email: string
}
type UserMenuResponse = Products.Menu[]

type AddMenuResponse = {
    menuId: number
}

export function fetchProductList(options: ProductListParams) {
    return sendRequest<ProductListResponse>({
        url: 'polls/get_product/',
        method: 'GET',
        query: options,
    })
}

export function fetchLogin(options: LoginOptions) {
    return sendRequest<AuthResponse>({
        url: 'login/',
        method: 'POST',
        payload: options,
    })
}
export function fetchSignup(options: SignUpOptions) {
    return sendRequest<AuthResponse>({
        url: 'signup/',
        method: 'POST',
        payload: options,
    })
}

export function fetchMe() {
    return sendRequest<MeResponse>({
        url: 'me/',
        method: 'GET',
    })
}
export function fetchProductListById(options: ProductListByIdParams) {
    return sendRequest<Products.IdToItemMapping>({
        url: 'products/by_id/',
        method: 'GET',
        query: options,
    })
}

export function fetchProductsByNutrient(options: ProductByNutrient) {
    return sendRequest<Products.ItemWithSingleNutrient[]>({
        url: `products/by_richness/${options.id}/`,
        method: 'GET',
    })
}

export function fetchNutrientCalculation(options: CalculationParams) {
    return sendRequest<Nutrients.NamesToItems>({
        url: 'polls/calculate_nutrients/',
        method: 'GET',
        query: addIdKeyPrefixToMapping(options),
    })
}

export function fetchMenuDelete(options: MenuDeleteOption) {
    return sendRequest<null>({
        url: `products/menu/${options.id}/`,
        method: 'DELETE',
    })
}

export function fetchUserMenus() {
    return sendRequest<UserMenuResponse>({
        url: 'products/menu/',
        method: 'GET',
    })
}

export function fetchAddUserMenu(options: addMenuParams) {
    const { description, name, ids } = options
    return sendRequest<AddMenuResponse>({
        url: 'products/menu/',
        method: 'POST',
        query: {
            description,
            name,
            ...addIdKeyPrefixToMapping(ids),
        },
    })
}

export function fetchPatchUserMenu(id: number, options: patchMenuParams) {
    console.log('options', options)

    return sendRequest<null>({
        url: `products/menu/${id}/`,
        method: 'PATCH',
        query: addIdKeyPrefixToMapping(options),
    })
}

// const token = data.result?.token
// token && setToken(token)
