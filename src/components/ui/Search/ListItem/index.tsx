import classNames from 'classnames'
import React from 'react'
import styles from './index.module.scss'

type ListItem = {
    item: Products.Item
    selectedProducts: Products.Selected
    addProduct: (product: Products.ItemSelected) => void
    isLoading?: boolean
}

const ListItem = ({
    item,
    selectedProducts,
    addProduct,
    isLoading = true,
}: ListItem) => {
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
                    isLoading,
                })
            }
        >
            {item.name} ({item.state})
        </li>
    )
}

export default ListItem
