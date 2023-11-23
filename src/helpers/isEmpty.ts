export function isEmpty(value: object | any[]): boolean {
    if (Array.isArray(value)) {
        return value.length === 0
    }

    if (typeof value === 'object') {
        return Object.keys(value).length === 0
    }

    return !value
}
