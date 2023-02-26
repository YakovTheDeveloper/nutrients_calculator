import { useProductStore } from '@data/products'
import Button from '@ui/Button'
import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import styles from './index.module.scss'

type SelectedProductsProps = {
    data?: Data.SelectedProducts
    button?: React.ReactElement | null
}

const ListItem = ({
    key,
    item,
    remove,
    setQuantity,
    setNeedToRecalculate,
    products,
}: any) => {
    // const remove = useProductStore((state) => state.removeProductFromSelected)
    // const setQuantity = useProductStore((state) => state.setProductQuantity)
    // const setNeedToRecalculate = useProductStore(
    //     (state) => state.setNeedToRecalculate
    // )
    // const products = useProductStore((state) => state.selectedProducts)
    const [message, setMessage] = useState('')

    console.log('render')
    return (
        <li key={key}>
            <input
                type="number"
                min="0"
                value={products[item.id].quantity.toString()}
                onChange={(e) => {
                    if (e.target.value.length > 6) return
                    setQuantity(item, +e.target.value)
                    setNeedToRecalculate(true)
                }}
                onBlur={(e) => {
                    if (+e.target.value === 0) setMessage('set quantity please')
                }}
            />
            <NavLink to={`product/${item.id}`} state={item}>
                Info
            </NavLink>
            {`${item.name} (${item.state})`}
            <span>{message}</span>
            <button onClick={() => remove(item)}>x</button>
        </li>
    )
}

const SelectedProducts = ({ data, button }: SelectedProductsProps) => {
    const remove = useProductStore((state) => state.removeProductFromSelected)
    const setQuantity = useProductStore((state) => state.setProductQuantity)
    const setNeedToRecalculate = useProductStore(
        (state) => state.setNeedToRecalculate
    )
    const products = useProductStore((state) => state.selectedProducts)

    return (
        <div className={styles.container}>
            <ul>
                {data &&
                    Object.values(data).map((item) => (
                        <ListItem
                            item={item}
                            key={item.id}
                            remove={remove}
                            setQuantity={setQuantity}
                            setNeedToRecalculate={setNeedToRecalculate}
                            products={products}
                        />
                    ))}
            </ul>
            {button}
        </div>
    )
}

export default SelectedProducts
