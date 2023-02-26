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
        <>
            {item.id in selectedProducts ? (
                <li
                    className={classNames(styles.listItem, styles.activeItem)}
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
            ) : (
                <li
                    className={styles.listItem}
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
            )}
        </>
    )
}

export default ListItem
