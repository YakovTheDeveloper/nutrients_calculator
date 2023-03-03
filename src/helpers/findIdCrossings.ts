export function findIdCrossings(firstArr: string[], secondArr: string[]) {
    return firstArr.filter((value) => !secondArr.includes(value))
}

//todo remove and replace with findDifference
