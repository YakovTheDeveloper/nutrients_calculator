import { apiBaseAddress } from '@constants/api'
import axios, { AxiosError, AxiosHeaders, AxiosRequestConfig } from 'axios'
import { getToken } from './localStorage'

type QueryParams = Record<string, string | string[] | number | undefined>

function queryParams(params: QueryParams) {
    return Object.keys(params)
        .map((key) => {
            const encodeKey = encodeURIComponent(key)
            if (Array.isArray(params[key])) {
                return (params[key] as string[])
                    .map((value) => `${encodeKey}=${encodeURIComponent(value)}`)
                    .join('&')
            }
            const value = params[key] ? params[key].toString()! : ''
            return `${encodeKey}=${encodeURIComponent(value)}`
        })
        .join('&')
}

type SendRequestParameters = {
    url: string
    query?: QueryParams
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    signal?: AbortSignal
    payload?: Record<string, unknown>
}

export async function sendRequest<T>({
    url,
    query,
    method = 'GET',
    payload,
}: SendRequestParameters): Promise<Api.Response<T>> {
    const params = query ? queryParams(query) : ''
    console.log('address', apiBaseAddress + '/' + url + '?' + params)
    try {
        const response = await axios<Api.Response<T>>(
            apiBaseAddress + '/' + url + '?' + params,
            createConfig(method, payload)
        )
        const body = response.data
        if (body.result == null)
            console.error('No "result" field in response body')

        const OkStatus = response.status >= 200 && response.status < 300
        if (OkStatus) return body

        return Promise.reject(response)
    } catch (error) {
        console.error(error)
        const err = error as AxiosError<Api.Response<T>>
        const errorMessage = err.response?.data?.detail || 'unknown error'
        return Promise.reject(errorMessage)
    }
}

function createConfig(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
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
