import { isEmpty } from '@helpers/isEmpty'

const maxDigits = {
    G: 1,
    UG: 4,
    KCAL: 1,
    MG: 2,
}

export function calculateTotalNutrients(
    selectedProducts: Products.Selected,
    idToItemMapping: Products.IdToItemMapping
): Nutrients.NamesToItems {
    return createInitialNameToNutrientData()
}

export function calculateTotalNutrients2(
    idToProduct: Products.IdToValueMapping,
    idToQuantity: { [key: number]: number }
) {
    const totalNutrients: Nutrients.IdToItem = {}

    for (const productId in idToProduct) {
        if (idToQuantity.hasOwnProperty(productId)) {
            const quantity = idToQuantity[productId]

            for (const nutrient of idToProduct[productId].nutrients) {
                if (totalNutrients[nutrient.id] == null) {
                    totalNutrients[nutrient.id] = {
                        ...nutrient,
                        amount: (nutrient.amount * quantity) / 100,
                    }
                    continue
                }
                totalNutrients[nutrient.id].amount +=
                    (nutrient.amount * quantity) / 100
            }
        }
    }

    for (const id in totalNutrients) {
        const unit = totalNutrients[id].unit
        totalNutrients[id].amount = +totalNutrients[id].amount.toFixed(
            maxDigits[unit]
        )
    }

    return totalNutrients
}

// export function calculateTotalNutrients(
//     selectedProducts: Products.Selected,
//     idToItemMapping: Products.IdToItemMapping
// ): Nutrients.NamesToItems {
//     if (isEmpty(idToItemMapping)) {
//         console.error('No product idToItemMapping found')
//         return createInitialNameToNutrientData()
//     }

//     const selectedProductsList = Object.values(selectedProducts),
//         allProductMultipliedNutrients: Nutrients.NamesToItems[] = []

//     selectedProductsList.forEach((el) => {
//         const quantity = el.quantity,
//             id = el.id,
//             nutrients = idToItemMapping[id].nutrients,
//             multipliedNutrients = multiplyEachNutrient(nutrients, quantity)
//         allProductMultipliedNutrients.push(multipliedNutrients)
//     })

//     const summarizedNutrients = sumAllProductsNutrients(
//         allProductMultipliedNutrients
//     )

//     const fixedNutrients = toFixedNutrientValues(summarizedNutrients)

//     console.log('fixedNutrients', fixedNutrients)
//     return fixedNutrients
// }

// function multiplyEachNutrient(
//     nutrients: Nutrients.NamesToItems,
//     quantity: number
// ) {
//     const result = createInitialNameToNutrientData()
//     Object.values(nutrients).forEach((nutrient: Nutrients.TableItem) => {
//         result[nutrient.name] = {
//             name: nutrient.name,
//             // nutrient.value is a value per 100 grams quantity
//             value: (nutrient.value * quantity) / 100,
//             unit: nutrient.unit,
//         }
//     })
//     return result
// }

// function sumAllProductsNutrients(
//     nutrientList: Nutrients.NamesToItems[]
// ): Nutrients.NamesToItems {
//     const result = createInitialNameToNutrientData()
//     nutrientList.forEach((product) => {
//         Object.values(product).forEach((nutrient: Nutrients.TableItem) => {
//             const nutrientData = result[nutrient.name]
//             const previousValue = nutrientData.value
//             const incomingValue = nutrient.value
//             result[nutrient.name] = {
//                 ...nutrientData,
//                 value: previousValue + incomingValue,
//             }
//         })
//     })
//     return result
// }

// const NUTRIENT_FRACTION_DIGITS: Nutrients.NamesToData<number> = {
//     protein: 0,
//     fat: 0,
//     carbohydrate: 0,
//     'vitamin a': 4,
//     'beta carotene': 4,
//     'alpha carotene': 4,
//     'vitamin d': 4,
//     'vitamin d2': 4,
//     'vitamin d3': 4,
//     'vitamin e': 1,
//     'vitamin k': 4,
//     'vitamin c': 1,
//     'vitamin b1': 1,
//     'vitamin b2': 1,
//     'vitamin b3': 1,
//     'vitamin b4': 1,
//     'vitamin b5': 1,
//     'vitamin b6': 1,
//     'vitamin b9': 4,
//     'vitamin b12': 4,
//     calcium: 1,
//     iron: 1,
//     magnesium: 1,
//     phosphorus: 1,
//     potassium: 1,
//     sodium: 1,
//     zinc: 1,
//     copper: 1,
//     manganese: 1,
//     selenium: 4,
//     fluoride: 1,
//     water: 0,
//     fiber: 0,
//     sugar: 0,
//     energy: 0,
// }

// function toFixedNutrientValues(
//     nutrients: Nutrients.NamesToItems
// ): Nutrients.NamesToItems {
//     const result: Nutrients.NamesToItems = createInitialNameToNutrientData()
//     const nutrientList: Nutrients.TableItem[] = Object.values(nutrients)

//     nutrientList.forEach((nutrient) => {
//         const fractionDigits = NUTRIENT_FRACTION_DIGITS[nutrient.name]
//         result[nutrient.name] = {
//             ...nutrient,
//             value: Number(nutrient.value.toFixed(fractionDigits)),
//         }
//     })
//     return result
// }

function createInitialNameToNutrientData(): Nutrients.NamesToItems {
    return {
        protein: {
            name: 'protein',
            value: 0,
            unit: 'g',
        },
        fat: {
            name: 'fat',
            value: 0,
            unit: 'g',
        },
        carbohydrate: {
            name: 'carbohydrate',
            value: 0,
            unit: 'g',
        },
        'vitamin a': {
            name: 'vitamin a',
            value: 0,
            unit: 'µg',
        },
        'beta carotene': {
            name: 'beta carotene',
            value: 0,
            unit: 'µg',
        },
        'alpha carotene': {
            name: 'alpha carotene',
            value: 0,
            unit: 'µg',
        },
        'vitamin d': {
            name: 'vitamin d',
            value: 0,
            unit: 'µg',
        },
        'vitamin d2': {
            name: 'vitamin d2',
            value: 0,
            unit: 'µg',
        },
        'vitamin d3': {
            name: 'vitamin d3',
            value: 0,
            unit: 'µg',
        },
        'vitamin e': {
            name: 'vitamin e',
            value: 0,
            unit: 'mg',
        },
        'vitamin k': {
            name: 'vitamin k',
            value: 0,
            unit: 'µg',
        },
        'vitamin c': {
            name: 'vitamin c',
            value: 0,
            unit: 'mg',
        },
        'vitamin b1': {
            name: 'vitamin b1',
            value: 0,
            unit: 'mg',
        },
        'vitamin b2': {
            name: 'vitamin b2',
            value: 0,
            unit: 'mg',
        },
        'vitamin b3': {
            name: 'vitamin b3',
            value: 0,
            unit: 'mg',
        },
        'vitamin b4': {
            name: 'vitamin b4',
            value: 0,
            unit: 'mg',
        },
        'vitamin b5': {
            name: 'vitamin b5',
            value: 0,
            unit: 'mg',
        },
        'vitamin b6': {
            name: 'vitamin b6',
            value: 0,
            unit: 'mg',
        },
        'vitamin b9': {
            name: 'vitamin b9',
            value: 0,
            unit: 'µg',
        },
        'vitamin b12': {
            name: 'vitamin b12',
            value: 0,
            unit: 'µg',
        },
        calcium: {
            name: 'calcium',
            value: 0,
            unit: 'mg',
        },
        iron: {
            name: 'iron',
            value: 0,
            unit: 'mg',
        },
        magnesium: {
            name: 'magnesium',
            value: 0,
            unit: 'mg',
        },
        phosphorus: {
            name: 'phosphorus',
            value: 0,
            unit: 'mg',
        },
        potassium: {
            name: 'potassium',
            value: 0,
            unit: 'mg',
        },
        sodium: {
            name: 'sodium',
            value: 0,
            unit: 'mg',
        },
        zinc: {
            name: 'zinc',
            value: 0,
            unit: 'mg',
        },
        copper: {
            name: 'copper',
            value: 0,
            unit: 'mg',
        },
        manganese: {
            name: 'manganese',
            value: 0,
            unit: 'mg',
        },
        selenium: {
            name: 'selenium',
            value: 0,
            unit: 'µg',
        },
        fluoride: {
            name: 'fluoride',
            value: 0,
            unit: 'µg',
        },
        water: {
            name: 'water',
            value: 0,
            unit: 'g',
        },
        fiber: {
            name: 'fiber',
            value: 0,
            unit: 'g',
        },
        sugar: {
            name: 'sugar',
            value: 0,
            unit: 'g',
        },
        energy: {
            name: 'energy',
            value: 0,
            unit: 'kcal',
        },
    }
}
