import { apiBaseAddress } from '@constants/api'
import { useProductStore } from '@data/products'
import Button from '@ui/Button'
import Search from '@ui/Search'
import SelectedProducts from '@ui/SelectedProducts'
import Table from '@ui/Table'
import React, { useState } from 'react'
import styles from './index.module.scss'



const SearchAndCalculate = () => {

    const selectedProducts = useProductStore((state) => state.selectedProducts)

    const isCalculateDisabled = Object.keys(selectedProducts).length === 0
    const [tableData, setTableData] = useState<Nutrients.NamesToItems>()

    const get = () => {
        const idWithQuantityParams = Object
            .entries(selectedProducts)
            .reduce((acc, [productId, { quantity }]) => {
                acc += `id${productId}=${quantity}&`
                return acc
            }, "?")
        console.log("idWithQuantityParams", idWithQuantityParams)
        fetch(`${apiBaseAddress}/polls/calculate_nutrients/${idWithQuantityParams}`)
            .then(res => res.json())
            .then((res: Api.Response<Nutrients.NamesToItems>) => setTableData(res.result))
    }

    return (
        <div className={styles.container}>
            <Search />
            <SelectedProducts data={selectedProducts} />
            <Button 
            disabled={isCalculateDisabled}
            onClick={() => get()}
            className={styles.calculateBtn}
            >Calculate</Button>
            <span>
                {" "}{isCalculateDisabled && 'Use search, then select your products'}

            </span>
            <Table data={tableData} />
        </div>
    )
}

export default SearchAndCalculate