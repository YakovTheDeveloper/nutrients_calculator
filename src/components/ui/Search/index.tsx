import { fetchProductList } from '@api/methods'
import { apiBaseAddress } from '@constants/api'
import { useProductStore } from '@data/products'
import { useKeyPressed } from '@hooks/useKeyPress'
import Input from '@ui/Input/Input'
import Table from '@ui/Table'
import React, { useEffect, useRef, useState } from 'react'
import styles from './index.module.scss'

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
        fetchProductList({ name: searchText })
            .then((res) => setData(res.result))
            .catch((err) => console.log(err))
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
                ></Input>

                <button className={styles.searchBtn} onClick={get}>
                    Search
                </button>
            </div>

            {showList && (
                <ul className={styles.list} ref={productList}>
                    {data?.map((item) => (
                        <li
                            key={item.id}
                            onClick={() =>
                                addProduct({
                                    ...item,
                                    quantity: 0,
                                })
                            }
                        >
                            {item.name} ({item.state})
                            {item.id in selectedProducts ? (
                                <span>✅</span>
                            ) : null}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default Search
