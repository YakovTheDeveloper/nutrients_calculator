import { idToValueMapping } from './../api/methods'
import { nutrientNameNormalized } from '@constants/nutrients'

export const getShortNutrientNameIfHas = (
    name: keyof Nutrients.NamesToItems
) => {
    return nutrientNameNormalized[name] || name
}

// {100: 200} => {id100: 200}
export const addIdKeyPrefixToMapping = (mapping: idToValueMapping) => {
    return Object.keys(mapping).reduce(
        (newMapping: Record<string, number>, id) => {
            newMapping['id' + id] = mapping[+id]
            return newMapping
        },
        {}
    )
}
