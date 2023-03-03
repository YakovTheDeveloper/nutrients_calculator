import React from 'react'
import styles from './index.module.scss'

type ListProps<T> = {
    data: Array<T>
}

const List = <T,>({ data }: ListProps<T>) => {
    return (
        <ul className={styles.list}>
            {/* ref={productList} */}
            {data?.map((item) => (
                <ListItem
                    key={item.id}
                    addProduct={addProduct}
                    item={item}
                    selectedProducts={selectedProducts}
                />
            ))}
        </ul>
    )
}

export default List
