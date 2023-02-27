export function deepCopy<T = any>(obj: object) {
    return JSON.parse(JSON.stringify(obj)) as T
}
