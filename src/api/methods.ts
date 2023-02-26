import { sendRequest } from './sendRequest'

type ProductListParams = {
    name: string
}
type ProductListByIdParams = {
    ids: string[] | string | number
}

type LoginParams = {
    email: string
    password: string
}
type SignUpParams = {
    email: string
    password: string
}

type CalculationParams = {
    [key: string]: string | number
}

type MenuDeleteOption = {
    id: number | string
}

type addMenuParams = {
    name: string
    description: string
    ids: {
        [key: string]: number
    }
}

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
    return sendRequest<Products.Item[]>({
        url: 'polls/get_product/',
        method: 'GET',
        query: options,
    })
}

export function fetchLogin(options: LoginParams) {
    return sendRequest<AuthResponse>({
        url: 'login/',
        method: 'POST',
        query: options,
    })
}
export function fetchSignup(options: SignUpParams) {
    return sendRequest<AuthResponse>({
        url: 'signup/',
        method: 'POST',
        query: options,
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
export function fetchNutrientCalculation(options: CalculationParams) {
    return sendRequest<Nutrients.NamesToItems>({
        url: 'polls/calculate_nutrients/',
        method: 'GET',
        query: options,
    })
}

export function fetchMenuDelete(options: MenuDeleteOption) {
    return sendRequest<null | undefined>({
        url: `products/menu/${options.id}/`,
        method: 'DELETE',
    })
}

export function fetchUserMenu() {
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
            ...ids,
        },
    })
}

// const token = data.result?.token
// token && setToken(token)
