import classNames from 'classnames'
import React from 'react'
import styles from './index.module.scss'

type ListItem = {
    item: Products.ItemWithNoNutrients
    selectedProducts: Products.Selected
    addProduct: (product: Products.ItemSelected) => void
    isLoading?: boolean
    children?: React.ReactNode
}

const ListItem = ({
    item,
    selectedProducts,
    addProduct,
    isLoading = true,
    children,
}: ListItem) => {
    return (
        <li
            className={classNames(styles.container, {
                [styles.activeItem]: item.id in selectedProducts,
            })}
            key={item.id}
            onClick={
                () =>
                    addProduct({
                        id: item.id,
                        name: item.name,
                        state: item.state,
                        category: item.category,
                        quantity: 0,
                        isLoading,
                    })
                // addProduct({
                //     ...item,
                //     quantity: 0,
                //     isLoading,
                // })
            }
        >
            {item.name} ({item.state}) {children}
        </li>
    )
}

export default ListItem
