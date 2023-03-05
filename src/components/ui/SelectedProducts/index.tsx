import { useProductStore } from '@data/products'
import { SelectedProductsToLoad } from '@pages/menu/OneMenu/useOneMenu'
import Button from '@ui/Button'
import React, { useEffect, useRef, useState } from 'react'
import ClearButton from '@ui/Button/ClearButton'
import Input from '@ui/Input/Input'
import { NavLink } from 'react-router-dom'
import styles from './index.module.scss'
import { BASE_APP_URL } from '@constants/url'

type SelectedProductsProps = {
    products?: Products.Selected
    button?: React.ReactElement | null
    remove: (product: Products.ItemSelected) => void
    setQuantity: (product: Products.ItemSelected, quantity: number) => void
    // | ((
    //       set: React.Dispatch<React.SetStateAction<Products.Selected>>
    //   ) => (product: Products.ItemSelected, quantity: number) => void)
    // selectedProducts: Products.Selected
    editMode: boolean
    //
}

type ListItemProps = {
    product: Products.ItemSelected
    remove: (product: Products.ItemSelected) => void
    setQuantity: (product: Products.ItemSelected, quantity: number) => void
    editMode: boolean
    isLoading?: boolean
}

const ListItem = ({
    product,
    remove,
    setQuantity,
    editMode,
    isLoading = false,
}: ListItemProps) => {
    const [message, setMessage] = useState('')
    const [history, setHistory] = useState<number[]>([])
    const [historyIndex, setHistoryIndex] = useState(-1)

    const isClearButtonShow = product.quantity > 0
    //todo ctrlz to custom hook
    function handleKeyDown(event: any) {
        if (event.ctrlKey && event.key === 'z') {
            event.preventDefault()
            const newHistoryIndex = historyIndex - 1
            if (newHistoryIndex >= 0) {
                setQuantity(product, history[newHistoryIndex])
                setHistoryIndex(newHistoryIndex)
            }
        }
    }

    function onChangeHandler(event: any) {
        if (event.target.value.length > 6) return
        if (event.target.value.includes('-')) return
        const newValue = +event.target.value
        const newHistory = [...history]
        newHistory[historyIndex + 1] = newValue
        setHistory(newHistory)
        setHistoryIndex(historyIndex + 1)
        setQuantity(product, newValue)
    }

    useEffect(() => {
        console.log('history', history)
        console.log('historyIndex', historyIndex)
    }, [history, historyIndex])

    return (
        <li key={product.id}>
            <NavLink
                to={`${BASE_APP_URL}/product/${product.id}`}
                state={product}
                className={styles.linkContainer}
            >
                <div className={styles.info}>
                    {`${product.name} (${product.state})`}
                </div>
            </NavLink>
            {editMode && (
                <button
                    onClick={() => remove(product)}
                    className={styles.deleteBtn}
                >
                    delete
                </button>
            )}

            {isLoading ? (
                <span>L O A D I N G ...</span>
            ) : (
                <Input
                    onKeyDown={handleKeyDown}
                    skeletonPreloader={isLoading && 'skeletonPreloader'}
                    size="small"
                    disabled={editMode === false || isLoading}
                    type="number"
                    min="0"
                    value={product.quantity?.toString()}
                    onChange={onChangeHandler}
                    onBlur={(e) => {
                        if (+e.target.value === 0)
                            setMessage(' Set quantity please')
                    }}
                >
                    {editMode && (
                        <ClearButton
                            show={isClearButtonShow}
                            onClick={() => setQuantity(product, 0)}
                            className={styles.container}
                        />
                    )}
                </Input>
            )}

            {/* {!isLoading ? (
                <span>L O A D I N G ...</span>
            ) : (
                <Input
                    onKeyDown={handleKeyDown}
                    className={styles.inputStyle}
                    size="small"
                    disabled={editMode === false}
                    type="number"
                    min="0"
                    value={product.quantity?.toString()}
                    onChange={onChangeHandler}
                    onBlur={(e) => {
                        if (+e.target.value === 0)
                            setMessage(' Set quantity please')
                    }}
                >
                    <ClearButton
                        show={isClearButtonShow}
                        onClick={() => setQuantity(product, 0)}
                        className={styles.container}
                    />
                </Input>
            )} */}

            <span>{message}</span>
        </li>
    )
}

function sortByName<T extends { name: string }>(a: T, b: T) {
    if (a.name < b.name) {
        return -1
    }
    if (a.name > b.name) {
        return 1
    }
    return 0
}

const SelectedProducts = ({
    products,
    button,
    remove,
    setQuantity,
    editMode = true,
}: SelectedProductsProps) => {
    // console.log('dataaaaaaa', data)
    return (
        <div className={styles.container}>
            <ul>
                {products &&
                    Object.values(products)
                        .sort(sortByName)
                        .map((product) => (
                            <ListItem
                                editMode={editMode}
                                product={product}
                                key={product.id}
                                remove={remove}
                                setQuantity={setQuantity}
                                isLoading={product.isLoading}
                            />
                        ))}
            </ul>
            {button}
        </div>
    )
}

export default SelectedProducts
