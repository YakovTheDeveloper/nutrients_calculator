import { fetchProductList } from '@api/methods'
import { apiBaseAddress } from '@constants/api'
import { useProductStore } from '@data/products'
import { useKeyPressed } from '@hooks/useKeyPress'
import Button from '@ui/Button'
import ClearButton from '@ui/Button/ClearButton'
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
        }
        document.addEventListener('click', handler)
        return () => {
            document.removeEventListener('click', handler)
        }
    }, [productList, setShowList, showList])

    const handleClearClick = () => {
        setSearchText('')
        setShowList(false)
    }

    const get = () => {
        fetchProductList({ name: searchText })
            .then((res) => setData(res.result))
            .catch((err) => console.log(err))
    }
    useKeyPressed('Enter', get)

    useEffect(() => {
        get()
        if (searchText) setShowList(true)
    }, [searchText])

    return (
        <div className={styles.container}>
            <div className={styles.inputContainer}>
                <Input
                    type="text"
                    placeholder="Enter the product"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    label="Search and select your products"
                    size="big"
                >
                    <ClearButton
                        onClick={handleClearClick}
                        className={styles.clearBtn}
                    />
                </Input>
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
