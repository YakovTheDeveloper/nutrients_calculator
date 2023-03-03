export function findDifference<T>(arr1: T[], arr2: T[]) {
    return arr1.filter((num) => !arr2.includes(num))
}
