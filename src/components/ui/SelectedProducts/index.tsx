import { useProductStore } from '@data/products'
import Button from '@ui/Button'
import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import styles from './index.module.scss'

type SelectedProductsProps = {
    data?: Data.SelectedProducts
    button?: React.ReactElement | null
    remove: (product: Data.SelectedProduct) => void
    setQuantity: (product: Data.SelectedProduct, quantity: number) => void
    // | ((
    //       set: React.Dispatch<React.SetStateAction<Data.SelectedProducts>>
    //   ) => (product: Data.SelectedProduct, quantity: number) => void)
    setNeedToRecalculate: (status: boolean) => void
    selectedProducts: Data.SelectedProducts
    editMode: boolean
}

const ListItem = ({
    key,
    product,
    remove,
    setQuantity,
    setNeedToRecalculate,
    editMode,
}: any) => {
    const [message, setMessage] = useState('')
    console.log('render')
    // console.log('products s s', products)
    console.log('products s s', product)
    return (
        <li key={key}>
            <input
                disabled={editMode === false}
                type="number"
                min="0"
                value={product.quantity?.toString()}
                onChange={(e) => {
                    if (e.target.value.length > 6) return
                    setQuantity(product, +e.target.value)
                    setNeedToRecalculate(true)
                }}
                onBlur={(e) => {
                    if (+e.target.value === 0) setMessage('set quantity please')
                }}
            />
            <NavLink to={`product/${product.id}`} state={product}>
                Info
            </NavLink>
            {`${product.name} (${product.state})`}
            <span>{message}</span>
            <button onClick={() => remove(product)}>x</button>
        </li>
    )
}

const SelectedProducts = ({
    data,
    button,
    remove,
    setQuantity,
    setNeedToRecalculate,
    selectedProducts,
    editMode = true,
}: SelectedProductsProps) => {
    console.log('dataaaaaaa', data)
    return (
        <div className={styles.container}>
            <ul>
                {data &&
                    Object.values(data).map((product) => (
                        <ListItem
                            editMode={editMode}
                            product={product}
                            key={product.id}
                            remove={remove}
                            setQuantity={setQuantity}
                            setNeedToRecalculate={setNeedToRecalculate}
                            products={selectedProducts}
                        />
                    ))}
            </ul>
            {button}
        </div>
    )
}

export default SelectedProducts
