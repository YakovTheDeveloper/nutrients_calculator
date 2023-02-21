import { get } from '@api'
import { apiBaseAddress } from '@constants/api'
import { initNutrients } from '@constants/nutrients'
import { useProductStore } from '@data/products'
import Button from '@ui/Button'
import Search from '@ui/Search'
import SelectedProducts from '@ui/SelectedProducts'
import Table from '@ui/Table'
import React, { useState } from 'react'



const SearchAndCalculate = () => {

    const selectedProducts = useProductStore((state) => state.selectedProducts)

    const isCalculateDisabled = Object.keys(selectedProducts).length === 0
    const [tableData, setTableData] = useState<Nutrients.NamesToItems>(initNutrients)

    const getData = () => {
        const idWithQuantityParams = Object
            .entries(selectedProducts)
            .reduce((acc, [productId, { quantity }]) => {
                acc += `id${productId}=${quantity}&`
                return acc
            }, "?")
        console.log("idWithQuantityParams", idWithQuantityParams)
        get(`polls/calculate_nutrients/${idWithQuantityParams}`)
            .then(res => {
                if (res.isError) {
                    return
                }
                const x: Nutrients.NamesToItems = res.result
                setTableData(x)
            })
        // fetch(`${apiBaseAddress}/polls/calculate_nutrients/${idWithQuantityParams}`)
        //     .then(res => res.json())
        //     .then((res: Api.Response<Nutrients.NamesToItems>) => setTableData(res.result))
    }

    return (
        <div>
            <Search />
            <SelectedProducts data={selectedProducts} />
            <Button disabled={isCalculateDisabled}
                onClick={() => getData()}
            >Calculate</Button>
            <span>
                {" "}{isCalculateDisabled && 'Use search, then select your products'}

            </span>
            <Table data={tableData} />
        </div>
    )
}

export default SearchAndCalculate