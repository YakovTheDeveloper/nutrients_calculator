import { apiBaseAddress } from '@constants/api'
import { useProductStore } from '@data/products'
import { useKeyPressed } from '@hooks/useKeyPress'
import Table from '@ui/Table'
import React, { useRef, useState } from 'react'
import styles from './index.module.scss'

type SearchProps = {

}


const Search = ({ }: SearchProps) => {

    const [data, setData] = useState<null | Products.Item[]>(null)
    const addProduct = useProductStore((state) => state.addProductToSelected)
    const selectedProducts = useProductStore((state) => state.selectedProducts)

    const inputRef = useRef<HTMLInputElement>()


    const get = () => {
        const searchText = inputRef?.current?.value
        fetch(`${apiBaseAddress}/polls/get_product/?name=${searchText}`)
            .then(res => res.json())
            .then((res: { result: Products.Item[] }) => {
                setData(res.result)
            })
    }
    useKeyPressed("Enter", get)



    return (
        <div className={styles.container}>
            <input type="text" ref={inputRef} />
            <button onClick={get}>Go!</button>
            {data?.map(item =>
                <div onClick={() => addProduct({
                    ...item,
                    quantity: 0
                })}>
                    {item.name} ({item.state})
                    {item.id in selectedProducts
                        ? <span>✅</span>
                        : null
                    }
                </div>
            )}
        </div>
    )


}

export default Search

