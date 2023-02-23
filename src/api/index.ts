import { apiBaseAddress } from '@constants/api'
import axios, { AxiosHeaders, AxiosRequestConfig, AxiosResponse } from 'axios'

const LOGIN_URL = 'login/'
const SIGN_UP_URL = 'signup/'
const ME_URL = 'me/'
const TOKEN = 'token'

export async function get(path: string) {
    return await sendRequest(path, createConfig('GET'))
}

export async function post(path: Api.urls, payload: object) {
    return await sendRequest(path, createConfig('POST', payload))
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
function createConfig(method = 'POST', payload?: any): AxiosRequestConfig {
    const headers = new AxiosHeaders()
    console.log('headers', headers)
    headers.set('Content-Type', 'application/json')
    // headers.append('Content-Type', 'application/json')
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
    isError: true,
    reason: 'Unknown error',
})

async function sendRequest(
    path: string,
    config: AxiosRequestConfig
): Promise<Api.Result> {
    let result = createDefaultResult()
    const url = `${apiBaseAddress}/${path}`
    try {
        const response = await axios(url, config)
        // console.log('url: ' + url)
        // console.log('response: ' + response)
        result = await addResponseDataToResult(response, result)
    } catch (error) {
        console.error(error)
    }
    return result
}

async function addResponseDataToResult(
    response: AxiosResponse<any, any>,
    data: Api.Result
) {
    const body = await response.data
    // const body = await response.json()
    const ok = response.status === 200 || response.statusText === 'OK'

    // const ok = response.ok

    response.status
    console.info('body,', body)
    if (!body.result) console.log('No "result" key in response body')
    if (ok) {
        data.result = body.result
        data.isError = false
        data.reason = ''
        return data
    }
    data.reason = body.reason?.toString()
    return data
}
// function fillWithResponseData(isOk: Response, data: Api.Result) {
//     const body = response.json()
//     if (isOk) {
//         data.result = body.result
//         data.isError = false
//         return data
//     }
//     data.reason = body.reason.toString()
//     return data
// }

// export const api = {
//     get,
//     post
// }

export function getToken() {
    return localStorage.getItem(TOKEN)
}
export function setToken(token: string) {
    return localStorage.setItem(TOKEN, token)
}
export function removeToken() {
    return localStorage.removeItem(TOKEN)
}
