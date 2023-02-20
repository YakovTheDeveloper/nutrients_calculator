import { useProductStore } from '@data/products'
import React from 'react'
import styles from './index.module.scss'

type SelectedProductsProps = {
    data?: Data.SelectedProducts
}


const SelectedProducts = ({ data }: SelectedProductsProps) => {
    const remove = useProductStore((state) => state.removeProductFromSelected)
    const setQuantity = useProductStore((state) => state.setProductQuantity)
    const products = useProductStore((state) => state.selectedProducts)
    return (
        <div className={styles.container}>
            <ul>
                {Object.values(data).map((item, index) => (
                    <li key={index}>
                        <input
                            type="number"
                            value={products[item.id].quantity.toString()}
                            onChange={(e) => {
                                if (e.target.value.length > 6) return
                                setQuantity(item, +e.target.value)
                            }}
                        />
                        {`${item.name} (${item.state})`}
                        <button onClick={() => remove(item)}>x</button>
                    </li>
                ))}
            </ul>
        </div>
    )


}

export default SelectedProducts
