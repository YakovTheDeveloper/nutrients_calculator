import {
    fetchProductListById,
    IdToValueMapping,
    ProductIdToQuantityMapping,
} from '@api/methods'
import { getProductsById, ProductState, useProductStore } from '@data/products'
import { useUserStore } from '@data/user'
import { calculateTotalNutrients } from '@helpers/calculateTotalNutrients'
import { deepCopy } from '@helpers/deepCopy'
import { findIdCrossings } from '@helpers/findIdCrossings'
import Button from '@ui/Button'
import SelectedProducts from '@ui/SelectedProducts'
import Table from '@ui/Table'
import React, { useEffect, useReducer, useState } from 'react'
import { createProductIdToQuantityMapping } from '@helpers/createProductIdToQuantityMapping'
import Search from '@ui/Search'
import { isEmpty } from '@helpers/isEmpty'
import styles from './index.module.scss'
import { UserState } from '@data/user'
import { findDifference } from '@helpers/findDifference'
import { useOneMenu } from './useOneMenu'
import Loader from '@ui/PreLoader'

export type OneMenuProps = {
    menu: Products.Menu
    removeMenu: UserState['removeMenu']
    patchMenuHandler: (
        id: number,
        idtToQuantityMapping: IdToValueMapping,
        newProducts?: Products.Selected
    ) => Promise<void>
    // patchMenuHandler: UserState['patchMenu']
    products: Products.IdToItemMapping
    fetchSelectedProductsFullData: ProductState['fetchSelectedProductsFullData']
}

const OneMenu = ({
    menu,
    removeMenu,
    patchMenuHandler,
    products,
    fetchSelectedProductsFullData,
}: OneMenuProps) => {
    // const products = deepCopy<Products.Selected>(menu.products)
    const {
        selectedProducts,
        totalNutrients,
        addProductToSelected,
        removeProductFromSelected,
        setProductQuantity,
        totalIdToQuantityMapping,
        editButtonHandler,
        backToInitialProducts,
        menuState: { editMode, initialLoading, showSaveButton, showSearch },
        dispatch,
    } = useOneMenu({ menu, products, fetchSelectedProductsFullData })

    async function saveHandler() {
        dispatch({ type: 'InitialLoadingOn' })
        await patchMenuHandler(
            menu.id,
            totalIdToQuantityMapping,
            selectedProducts
        )
        dispatch({ type: 'InitialLoadingOff' })
        dispatch({ type: 'EDIT_MODE_OFF' })

        // setEditMode(false)
        // setShowSaveButton(false)
        // setShowSearch(false)
    }

    return (
        <div className={styles.container}>
            <h1>{initialLoading && <Loader />}</h1>
            {!initialLoading && (
                <div className={styles.buttonPanel}>
                    {showSearch && (
                        <Search
                            addProductToSelected={addProductToSelected}
                            selectedProducts={selectedProducts}
                        />
                    )}

                    <div className={styles.menuNameAndEditContainer}>
                        <h2 className={styles.menuName}>{menu.name}</h2>
                        <Button
                            onClick={editButtonHandler}
                            bordered
                            size="small"
                        >
                            {editMode ? 'cancel' : 'edit'}
                        </Button>
                    </div>

                    {editMode && (
                        <Button
                            bordered
                            onClick={() => dispatch({ type: 'SHOW_SEARCH' })}
                            size="small"
                        >
                            add new product
                        </Button>
                    )}

                    <div className={styles.saveBtnContainer}>
                        {showSaveButton && (
                            <Button onClick={saveHandler} bordered size="small">
                                {initialLoading ? 'Loading...' : 'save changes'}
                            </Button>
                        )}
                    </div>
                </div>
            )}

            {/* <Button onClick={() => setEditMode(true)} bordered>
                Edit menu
            </Button>
            {showSaveButton && <Button bordered>Save changes</Button>}
            {showSaveButton && (
                <Button
                    onClick={() => {
                        patchMenu(menu.id, getChangedProducts())
                    }}
                >
                    Save changes
                </Button>
            )} */}

            <SelectedProducts
                editMode={editMode}
                products={selectedProducts}
                remove={removeProductFromSelected}
                setQuantity={setProductQuantity}
            />

            {/* <ul>
                {Object.values(selectedProductsIdsToLoad).map(
                    (loadingProduct) =>
                        loadingProduct.isLoading ? (
                            <span>LOADING: {loadingProduct.name}</span>
                        ) : null
                )}
            </ul> */}

            <Table data={totalNutrients}></Table>
            <Button onClick={() => removeMenu(menu.id)} bordered size="medium">
                delete {menu.name}
            </Button>
        </div>
    )
}

export default OneMenu
