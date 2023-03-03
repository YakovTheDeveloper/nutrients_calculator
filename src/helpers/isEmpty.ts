// export const isEmpty = (object: object & { length?: never }) => {
//     return Object.keys(object).length === 0
// }
export function isEmpty(value: object | any[]): boolean {
    if (Array.isArray(value)) {
        return value.length === 0
    }

    if (typeof value === 'object') {
        return Object.keys(value).length === 0
    }

    return !value
}
