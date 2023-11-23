import { NutrientCodes, nutrientDailyNormCode, NutrientsNorm } from '@constants/nutrients';

export const getDailyNormPercent = (
    code: NutrientCodes,
    value: number,
    norms: NutrientsNorm = nutrientDailyNormCode
) => {
    const norm = norms.norm[code];
    if (!norm) return null;
    return Number(((value / norm) * 100).toFixed(0));
};
