/* Output would be like: {
    id100:200,
    id101:300,
    etc..
}*/
export function createProductIdToQuantityMapping(
    products: Data.SelectedProducts
) {
    return Object.entries(products).reduce(
        (acc: Record<string, number>, [productId, { quantity }]) => {
            acc[productId] = quantity
            return acc
        },
        {}
    )
}
