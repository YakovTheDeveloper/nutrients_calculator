import { Norm } from '../types/declaration';

export enum NutrientCodes {
    Protein = 203,
    Fat = 204,
    Carbohydrate = 205,
    VitaminA = 320,
    BetaCarotene = 321,
    AlphaCarotene = 322,
    VitaminD = 328,
    VitaminD2 = 325,
    VitaminD3 = 326,
    VitaminE = 394,
    VitaminK = 428,
    VitaminC = 401,
    VitaminB1 = 404,
    VitaminB2 = 405,
    VitaminB3 = 406,
    VitaminB4 = 421,
    VitaminB5 = 410,
    VitaminB6 = 415,
    VitaminB9 = 417,
    VitaminB12 = 418,
    Calcium = 301,
    Iron = 303,
    Magnesium = 304,
    Phosphorus = 305,
    Potassium = 306,
    Sodium = 307,
    Zinc = 309,
    Copper = 312,
    Manganese = 315,
    Selenium = 317,
    Fluoride = 313,
    Water = 255,
    Fiber = 291,
    Sugar = 269,
    Energy = 1200,
}

export const nutrientCodeToName: Record<NutrientCodes, string> = {
    [NutrientCodes.Protein]: 'Protein',
    [NutrientCodes.Fat]: 'Fat',
    [NutrientCodes.Carbohydrate]: 'Carbohydrate',
    [NutrientCodes.VitaminA]: 'Vitamin A',
    [NutrientCodes.BetaCarotene]: 'Beta Carotene',
    [NutrientCodes.AlphaCarotene]: 'Alpha Carotene',
    [NutrientCodes.VitaminD]: 'Vitamin D',
    [NutrientCodes.VitaminD2]: 'Vitamin D2',
    [NutrientCodes.VitaminD3]: 'Vitamin D3',
    [NutrientCodes.VitaminE]: 'Vitamin E',
    [NutrientCodes.VitaminK]: 'Vitamin K',
    [NutrientCodes.VitaminC]: 'Vitamin C',
    [NutrientCodes.VitaminB1]: 'Vitamin B1',
    [NutrientCodes.VitaminB2]: 'Vitamin B2',
    [NutrientCodes.VitaminB3]: 'Vitamin B3',
    [NutrientCodes.VitaminB4]: 'Vitamin B4',
    [NutrientCodes.VitaminB5]: 'Vitamin B5',
    [NutrientCodes.VitaminB6]: 'Vitamin B6',
    [NutrientCodes.VitaminB9]: 'Vitamin B9',
    [NutrientCodes.VitaminB12]: 'Vitamin B12',
    [NutrientCodes.Calcium]: 'Calcium',
    [NutrientCodes.Iron]: 'Iron',
    [NutrientCodes.Magnesium]: 'Magnesium',
    [NutrientCodes.Phosphorus]: 'Phosphorus',
    [NutrientCodes.Potassium]: 'Potassium',
    [NutrientCodes.Sodium]: 'Sodium',
    [NutrientCodes.Zinc]: 'Zinc',
    [NutrientCodes.Copper]: 'Copper',
    [NutrientCodes.Manganese]: 'Manganese',
    [NutrientCodes.Selenium]: 'Selenium',
    [NutrientCodes.Fluoride]: 'Fluoride',
    [NutrientCodes.Water]: 'Water',
    [NutrientCodes.Fiber]: 'Fiber',
    [NutrientCodes.Sugar]: 'Sugar',
    [NutrientCodes.Energy]: 'Energy'
};


export type NutrientsNorm = {
    id: string,
    name: string,
    norm: Record<NutrientCodes, number>
}

//norm => NutrientCodeToNormValue
//todo need deep freeze util
export const nutrientDailyNormCode: Norm.Item = {
    id: '-1000',
    name: 'Standard',
    norm: Object.freeze({
        [NutrientCodes.Protein]: 75,
        [NutrientCodes.Fat]: 84,
        [NutrientCodes.Carbohydrate]: 310,
        [NutrientCodes.VitaminA]: 900,
        [NutrientCodes.BetaCarotene]: 5000,
        [NutrientCodes.AlphaCarotene]: 5000,
        [NutrientCodes.VitaminD]: 16,
        [NutrientCodes.VitaminD2]: 7,
        [NutrientCodes.VitaminD3]: 16,
        [NutrientCodes.VitaminE]: 14.6,
        [NutrientCodes.VitaminK]: 120,
        [NutrientCodes.VitaminC]: 90,
        [NutrientCodes.VitaminB1]: 1.2,
        [NutrientCodes.VitaminB2]: 1.3,
        [NutrientCodes.VitaminB3]: 16,
        [NutrientCodes.VitaminB4]: 500,
        [NutrientCodes.VitaminB5]: 5,
        [NutrientCodes.VitaminB6]: 1.3,
        [NutrientCodes.VitaminB9]: 400,
        [NutrientCodes.VitaminB12]: 2.4,
        [NutrientCodes.Calcium]: 1000,
        [NutrientCodes.Iron]: 10,
        [NutrientCodes.Magnesium]: 400,
        [NutrientCodes.Phosphorus]: 700,
        [NutrientCodes.Potassium]: 4700,
        [NutrientCodes.Sodium]: 1300,
        [NutrientCodes.Zinc]: 11,
        [NutrientCodes.Copper]: 0.9,
        [NutrientCodes.Manganese]: 2.3,
        [NutrientCodes.Selenium]: 55,
        [NutrientCodes.Fluoride]: 4000,
        [NutrientCodes.Water]: 1500,
        [NutrientCodes.Fiber]: 25,
        [NutrientCodes.Sugar]: 20,
        [NutrientCodes.Energy]: 1200
    }
    )
};

export const nutrientDailyNormSport: Norm.Item = {
    id: '-1001',
    name: 'Sport',
    norm: Object.freeze({
        [NutrientCodes.Protein]: 120,
        [NutrientCodes.Fat]: 84,
        [NutrientCodes.Carbohydrate]: 310,
        [NutrientCodes.VitaminA]: 900,
        [NutrientCodes.BetaCarotene]: 5000,
        [NutrientCodes.AlphaCarotene]: 5000,
        [NutrientCodes.VitaminD]: 16,
        [NutrientCodes.VitaminD2]: 7,
        [NutrientCodes.VitaminD3]: 16,
        [NutrientCodes.VitaminE]: 14.6,
        [NutrientCodes.VitaminK]: 120,
        [NutrientCodes.VitaminC]: 90,
        [NutrientCodes.VitaminB1]: 1.2,
        [NutrientCodes.VitaminB2]: 1.3,
        [NutrientCodes.VitaminB3]: 16,
        [NutrientCodes.VitaminB4]: 500,
        [NutrientCodes.VitaminB5]: 5,
        [NutrientCodes.VitaminB6]: 1.3,
        [NutrientCodes.VitaminB9]: 400,
        [NutrientCodes.VitaminB12]: 2.4,
        [NutrientCodes.Calcium]: 1000,
        [NutrientCodes.Iron]: 10,
        [NutrientCodes.Magnesium]: 400,
        [NutrientCodes.Phosphorus]: 700,
        [NutrientCodes.Potassium]: 4700,
        [NutrientCodes.Sodium]: 1300,
        [NutrientCodes.Zinc]: 11,
        [NutrientCodes.Copper]: 0.9,
        [NutrientCodes.Manganese]: 2.3,
        [NutrientCodes.Selenium]: 55,
        [NutrientCodes.Fluoride]: 4000,
        [NutrientCodes.Water]: 1500,
        [NutrientCodes.Fiber]: 25,
        [NutrientCodes.Sugar]: 20,
        [NutrientCodes.Energy]: 1200
    }
    )
};

// export const nutrientDailyNorm: Nutrients.NamesToData<number> = {
//     "protein": 75,
//     "fat": 84,
//     "carbohydrate": 310,
//     "vitamin a": 900,
//     "beta carotene": 5000,
//     "alpha carotene": 5000,
//     "vitamin d": 16,
//     "vitamin d2": 7,
//     "vitamin d3": 16,
//     "vitamin e": 14.6,
//     "vitamin k": 120,
//     "vitamin c": 90,
//     "vitamin b1": 1.2,
//     "vitamin b2": 1.3,
//     "vitamin b3": 16,
//     "vitamin b4": 500,
//     "vitamin b5": 5,
//     "vitamin b6": 1.3,
//     "vitamin b9": 400,
//     "vitamin b12": 2.4,
//     "calcium": 1000,
//     "iron": 10,
//     "magnesium": 400,
//     "phosphorus": 700,
//     "potassium": 4700,
//     "sodium": 1300,
//     "zinc": 11,
//     "copper": 0.9,
//     "manganese": 2.3,
//     "selenium": 55,
//     "fluoride": 4000,
//     "water": 1500,
//     "fiber": 25,
//     "sugar": 20,
//     "energy": 1200
// };

// export const initNutrients: Nutrients.NamesToItems = {
//     "protein": {
//         "name": "protein",
//         "value": 0,
//         "unit": "g"
//     },
//     "fat": {
//         "name": "fat",
//         "value": 0,
//         "unit": "g"
//     },
//     "carbohydrate": {
//         "name": "carbohydrate",
//         "value": 0,
//         "unit": "g"
//     },
//     "vitamin a": {
//         "name": "vitamin a",
//         "value": 0,
//         "unit": "µg"
//     },
//     "beta carotene": {
//         "name": "beta carotene",
//         "value": 0,
//         "unit": "µg"
//     },
//     "alpha carotene": {
//         "name": "alpha carotene",
//         "value": 0,
//         "unit": "µg"
//     },
//     "vitamin d": {
//         "name": "vitamin d",
//         "value": 0,
//         "unit": "µg"
//     },
//     "vitamin d2": {
//         "name": "vitamin d2",
//         "value": 0,
//         "unit": "µg"
//     },
//     "vitamin d3": {
//         "name": "vitamin d3",
//         "value": 0,
//         "unit": "µg"
//     },
//     "vitamin e": {
//         "name": "vitamin e",
//         "value": 0,
//         "unit": "mg"
//     },
//     "vitamin k": {
//         "name": "vitamin k",
//         "value": 0,
//         "unit": "µg"
//     },
//     "vitamin c": {
//         "name": "vitamin c",
//         "value": 0,
//         "unit": "mg"
//     },
//     "vitamin b1": {
//         "name": "vitamin b1",
//         "value": 0,
//         "unit": "mg"
//     },
//     "vitamin b2": {
//         "name": "vitamin b2",
//         "value": 0,
//         "unit": "mg"
//     },
//     "vitamin b3": {
//         "name": "vitamin b3",
//         "value": 0,
//         "unit": "mg"
//     },
//     "vitamin b4": {
//         "name": "vitamin b4",
//         "value": 0,
//         "unit": "mg"
//     },
//     "vitamin b5": {
//         "name": "vitamin b5",
//         "value": 0,
//         "unit": "mg"
//     },
//     "vitamin b6": {
//         "name": "vitamin b6",
//         "value": 0,
//         "unit": "mg"
//     },
//     "vitamin b9": {
//         "name": "vitamin b9",
//         "value": 0,
//         "unit": "µg"
//     },
//     "vitamin b12": {
//         "name": "vitamin b12",
//         "value": 0,
//         "unit": "µg"
//     },
//     "calcium": {
//         "name": "calcium",
//         "value": 0,
//         "unit": "mg"
//     },
//     "iron": {
//         "name": "iron",
//         "value": 0,
//         "unit": "mg"
//     },
//     "magnesium": {
//         "name": "magnesium",
//         "value": 0,
//         "unit": "mg"
//     },
//     "phosphorus": {
//         "name": "phosphorus",
//         "value": 0,
//         "unit": "mg"
//     },
//     "potassium": {
//         "name": "potassium",
//         "value": 0,
//         "unit": "mg"
//     },
//     "sodium": {
//         "name": "sodium",
//         "value": 0,
//         "unit": "mg"
//     },
//     "zinc": {
//         "name": "zinc",
//         "value": 0,
//         "unit": "mg"
//     },
//     "copper": {
//         "name": "copper",
//         "value": 0,
//         "unit": "mg"
//     },
//     "manganese": {
//         "name": "manganese",
//         "value": 0,
//         "unit": "mg"
//     },
//     "selenium": {
//         "name": "selenium",
//         "value": 0,
//         "unit": "µg"
//     },
//     "fluoride": {
//         "name": "fluoride",
//         "value": 0,
//         "unit": "µg"
//     },
//     "water": {
//         "name": "water",
//         "value": 0,
//         "unit": "g"
//     },
//     "fiber": {
//         "name": "fiber",
//         "value": 0,
//         "unit": "g"
//     },
//     "sugar": {
//         "name": "sugar",
//         "value": 0,
//         "unit": "g"
//     },
//     "energy": {
//         "name": "energy",
//         "value": 0,
//         "unit": "kcal"
//     }
// };

export const nutrientNameNormalized: Nutrients.NameNormalized = {
    'protein': 'Protein',
    'carbohydrate': 'Carbs',
    'fat': 'Fat',
    'fiber': 'Fiber',
    'energy': 'Energy',
    'sugar': 'Sugar',
    'water': 'Water',
    'vitamin a': 'A',
    'vitamin c': 'C',
    'vitamin d': 'D',
    'vitamin d2': 'D2',
    'vitamin d3': 'D3',
    'vitamin e': 'E',
    'vitamin k': 'K',
    'vitamin b1': 'B1',
    'vitamin b2': 'B2',
    'vitamin b3': 'B3',
    'vitamin b4': 'B4',
    'vitamin b5': 'B5',
    'vitamin b6': 'B6',
    'vitamin b9': 'B9',
    'vitamin b12': 'B12',
    'alpha carotene': 'α Carotene',
    'beta carotene': 'β Carotene',
    'calcium': 'Calcium',
    'iron': 'Iron',
    'magnesium': 'Magnesium',
    'phosphorus': 'Phosphorus',
    'potassium': 'Potassium',
    'sodium': 'Sodium',
    'zinc': 'Zinc',
    'copper': 'Copper',
    'manganese': 'Manganese',
    'selenium': 'Selenium',
    'fluoride': 'Fluoride'
};

