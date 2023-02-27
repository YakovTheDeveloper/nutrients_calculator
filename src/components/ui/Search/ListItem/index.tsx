import classNames from 'classnames'
import React from 'react'
import styles from './index.module.scss'

type ListItem = {
    item: Products.Item
    selectedProducts: Data.SelectedProducts
    addProduct: (product: Data.SelectedProduct) => void
}

const ListItem = ({ item, selectedProducts, addProduct }: ListItem) => {
    return (
        <li
            className={classNames(styles.container, {
                [styles.activeItem]: item.id in selectedProducts,
            })}
            key={item.id}
            onClick={() =>
                addProduct({
                    ...item,
                    quantity: 0,
                })
            }
        >
            {item.name} ({item.state})
        </li>
    )
}

export default ListItem
