export const groupNutrientsByCategory = <T = Nutrients.item>(
    data: Nutrients.NamesToData<T>
): Nutrients.Groups => {
    const mainNutrients = [
        data.protein,
        data.fat,
        data.carbohydrate,
        data.fiber,
        data.sugar,
    ];
    const misc = [
        data.energy,
        data.water,
        data['alpha carotene'],
        data['beta carotene'],
    ];
    const vitaminsB = [
        data['vitamin b1'],
        data['vitamin b2'],
        data['vitamin b3'],
        data['vitamin b4'],
        data['vitamin b5'],
        data['vitamin b6'],
        data['vitamin b9'],
        data['vitamin b12'],
    ];

    const VitaminsNotB = [
        data['vitamin a'],
        data['vitamin c'],
        data['vitamin d'],
        data['vitamin d2'],
        data['vitamin d3'],
        data['vitamin e'],
        data['vitamin k'],
    ];

    const minerals = [
        data['calcium'],
        data['iron'],
        data['magnesium'],
        data['phosphorus'],
        data['potassium'],
        data['sodium'],
        data['zinc'],
        data['copper'],
        data['manganese'],
        data['selenium'],
        data['fluoride'],
    ];

    return {
        mainNutrients: mainNutrients,
        misc: misc,
        VitaminsNotB: VitaminsNotB,
        vitaminsB: vitaminsB,
        minerals: minerals,
    };
};
