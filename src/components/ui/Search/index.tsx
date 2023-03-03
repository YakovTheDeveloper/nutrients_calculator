import { fetchProductList } from '@api/methods'
import { apiBaseAddress } from '@constants/api'
import { useProductStore } from '@data/products'
import { useKeyPressed } from '@hooks/useKeyPress'
import Button from '@ui/Button'
import Input from '@ui/Input/Input'
import Table from '@ui/Table'
import React, { useEffect, useRef, useState } from 'react'
import styles from './index.module.scss'
import ListItem from './ListItem'

type SearchProps = {
    // products: null | Products.Item[]
    onItemClick?: () => void
    addProductToSelected: (product: Products.ItemSelected) => void
    selectedProducts: Products.Selected
}

const Search = ({ addProductToSelected, selectedProducts }: SearchProps) => {
    const [searchText, setSearchText] = useState('')
    const [data, setData] = useState<null | Products.Item[]>(null)
    const [showList, setShowList] = useState(false)

    // Give props everywheere
    // const addProduct = useProductStore((state) => state.addProductToSelected)
    // const selectedProducts = useProductStore((state) => state.selectedProducts)

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
                    clear={handleClearClick}
                    label="Search and select your products"
                    size="big"
                ></Input>
            </div>

            {showList && (
                <ul className={styles.list} ref={productList}>
                    {data?.map((item) => (
                        <ListItem
                            key={item.id}
                            addProduct={addProductToSelected}
                            item={item}
                            selectedProducts={selectedProducts}
                            isLoading={false}
                        />
                    ))}
                </ul>
            )}
        </div>
    )
}

export default Search
