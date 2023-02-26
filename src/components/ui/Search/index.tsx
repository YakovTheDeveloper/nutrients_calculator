import { apiBaseAddress } from '@constants/api'
import { useProductStore } from '@data/products'
import { useKeyPressed } from '@hooks/useKeyPress'
import Button from '@ui/Button'
import Input from '@ui/Input/Input'
import Table from '@ui/Table'
import React, { useEffect, useRef, useState } from 'react'
import styles from './index.module.scss'
import ListItem from './ListItem'

type SearchProps = {}

const Search = ({}: SearchProps) => {
    const [data, setData] = useState<null | Products.Item[]>(null)
    const addProduct = useProductStore((state) => state.addProductToSelected)
    const selectedProducts = useProductStore((state) => state.selectedProducts)
    const [searchText, setSearchText] = useState('')

    const [showList, setShowList] = useState(false)

    const productList = useRef<HTMLUListElement>(null)

    useEffect(() => {
        const handler = (e) => {
            const target = e.target as HTMLElement
            if (target?.contains(productList.current)) setShowList(false)
            console.log('lol')
        }
        document.addEventListener('click', handler)
        return () => {
            document.removeEventListener('click', handler)
        }
    }, [productList, setShowList, showList])

    const handleClearClick = () => {
        setSearchText('')
    }

    const get = () => {
        console.log(`${apiBaseAddress}/polls/get_product/?name=${searchText}`)
        fetch(`${apiBaseAddress}/polls/get_product/?name=${searchText}`)
            .then((res) => res.json())
            .then((res: { result: Products.Item[] }) => {
                setData(res.result)
            })
    }
    useKeyPressed('Enter', get)

    useEffect(() => {
        get()
        setShowList(true)
    }, [searchText])

    return (
        <div className={styles.container}>
            <div className={styles.inputContainer}>
                <Input
                    className={styles.input}
                    type="text"
                    placeholder="Enter the product"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    clear={handleClearClick}
                    label="Search and select your products"
                ></Input>
            </div>

            {showList && (
                <ul className={styles.list} ref={productList}>
                    {data?.map((item) => (
                        <ListItem
                            key={item.id}
                            addProduct={addProduct}
                            item={item}
                            selectedProducts={selectedProducts}
                        />
                    ))}
                </ul>
            )}
        </div>
    )
}

export default Search
