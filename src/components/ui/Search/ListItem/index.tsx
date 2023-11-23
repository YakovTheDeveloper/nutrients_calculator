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
    const { id, name, description } = item
    console.log('item', item)
    return (
        <li
            className={classNames(styles.container, {
                [styles.activeItem]: item.id in selectedProducts,
            })}
            key={item.id}
            onClick={
                () =>
                    addProduct({
                        id,
                        name,
                        description,
                        quantity: 0,
                        category: 'foo',
                        isLoading,
                    })
                // addProduct({
                //     ...item,
                //     quantity: 0,
                //     isLoading,
                // })
            }
        >
            {name} ({description}) {children}
        </li>
    )
}

export default ListItem


