import { nutrientDailyNorm } from '@constants/nutrients'

export const getDailyNormPercent = (
    name: Nutrients.Name,
    value: number,
    norms: Nutrients.NamesToData<number> = nutrientDailyNorm
) => {
    const norm = norms[name]
    return Number(((value / norm) * 100).toFixed(1))
}
