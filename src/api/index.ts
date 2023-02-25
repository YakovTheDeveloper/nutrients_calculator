import { apiBaseAddress } from '@constants/api'
import axios, { AxiosHeaders, AxiosRequestConfig, AxiosResponse } from 'axios'

const LOGIN_URL = 'login/'
const SIGN_UP_URL = 'signup/'
const ME_URL = 'me/'
const TOKEN = 'token'







export async function get(path: string) {
    return await sendRequest(path, createConfig('GET'))
}
export async function getTyped<T>(path: string) {
    return await sendRequest<T>(path, createConfig('GET'))
}

export async function post(path: string, payload?: object) {
    return await sendRequest(path, createConfig('POST', payload))
}

export async function del(path: string) {
    return await sendRequest(path, createConfig('DELETE'))
}

export async function login(payload: Api.UserToAuth) {
    const data = await sendRequest(LOGIN_URL, createConfig('POST', payload))
    const token = data.result?.token
    token && setToken(token)
    return data
}

export async function getMe() {
    return await sendRequest(ME_URL, createConfig('GET'))
}

export async function signup(payload: Api.UserToAuth) {
    const data = await sendRequest(SIGN_UP_URL, createConfig('POST', payload))
    const token = data.result?.token
    token && setToken(token)
    return data
}

// function createConfig(method = 'POST', payload?: any): RequestInit {
function createConfig(
    method = 'POST',
    payload?: Record<any, any>
): AxiosRequestConfig {
    const headers = new AxiosHeaders()
    headers.set('Content-Type', 'application/json')
    const token = getToken()
    token && headers.set('Authorization', `Token ${token}`)

    const result: AxiosRequestConfig = {
        method: method,
        headers,
    }
    if (payload) result.data = JSON.stringify(payload)
    return result
}

export const createDefaultResult = (): Api.Result => ({
    result: null,
    hasError: true,
    detail: 'Unknown error',
})

async function sendRequest<T>(
    path: string,
    config: AxiosRequestConfig
): Promise<Api.Result<T>> {
    let result = createDefaultResult()
    const url = `${apiBaseAddress}/${path}`
    try {
        const response = await axios<Api.Response<T>>(url, config)
        result = await addResponseDataToResult<T>(response, result)
    } catch (error) {
        console.error(error)
    }
    return result
}

async function addResponseDataToResult<T>(
    response: AxiosResponse<Api.Response<T>, any>,
    data: Api.Result<T>
) {
    const body = response.data
    const result: T = body.result

    if (body.result == null)
        console.error(
            'No "result" field in response body: ' + JSON.stringify(body)
        )
    console.log('response', response)
    const isStatusWithinOkRange =
        response.status >= 200 && response.status < 300
    const ok = isStatusWithinOkRange || response.statusText === 'OK'
    if (ok) {
        data.result = result
        data.hasError = false
        data.detail = ''
        return data
    }
    data.detail = body.detail?.toString()
    return data
}

export function getToken() {
    return localStorage.getItem(TOKEN)
}
export function setToken(token: string) {
    return localStorage.setItem(TOKEN, token)
}
export function removeToken() {
    return localStorage.removeItem(TOKEN)
}
