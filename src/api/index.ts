import { apiBaseAddress } from '@constants/api';

const LOGIN_URL = 'login/'
const SIGN_UP = 'signup/'

export async function get(path: string) {
    return await sendRequest(path, createConfig("GET"))
}

export async function post(path: Api.urls, payload: object) {
    return await sendRequest(path, createConfig("POST", payload))
}

export async function login(payload: Api.UserToAuth) {
    const data = await sendRequest(LOGIN_URL, createConfig("POST", payload))
    const token = data.result?.token
    token && setToken(token)
    return data
}

export async function signup(payload: Api.UserToAuth) {
    const data = await sendRequest(SIGN_UP, createConfig("POST", payload))
    const token = data.result?.token
    token && setToken(token)
    return data
}


function createConfig(method = 'POST', payload?: any,) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const token = getToken()
    token && headers.append('Authorization', `Token ${token}`);

    const result: RequestInit = {
        method: method,
        headers,
    }
    if (payload) result.body = JSON.stringify(payload);
    return result
}

const createDefaultResult = (): Api.Result => ({
    result: null,
    isError: true,
    reason: "Unknown error"
})

async function sendRequest(path: string, config: RequestInit): Promise<Api.Result> {
    let result = createDefaultResult()
    const url = `${apiBaseAddress}/${path}`
    try {
        const response = await fetch(url, config)
        result = await fillWithResponseData(response, result)
    }
    catch (error) { console.error(error) }
    return result
}

async function fillWithResponseData(response: Response, data: Api.Result) {
    const body = await response.json()
    if (response.ok) {
        data.result = body.result
        data.isError = false
        return data
    }
    data.reason = body.reason.toString()
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

function getToken() { return localStorage.getItem('token') }
function setToken(token: string) { return localStorage.setItem('token', token) }