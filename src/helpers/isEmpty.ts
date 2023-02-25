export const isEmpty = (object: object & { length?: never }) => {
    return Object.keys(object).length === 0
}
