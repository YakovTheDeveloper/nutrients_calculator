import { nutrientNameNormalized } from '@constants/nutrients'

export const getShortNutrientNameIfHas = (
    name: keyof Nutrients.NamesToItems
) => {
    return nutrientNameNormalized[name] || name
}
