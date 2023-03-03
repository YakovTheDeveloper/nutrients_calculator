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
        <div>
            <h1>{initialLoading && 'L.O.A.D.I.N.G'}</h1>
            {!initialLoading && (
                <div className={styles.buttonPanel}>
                    {showSearch && (
                        <Search
                            addProductToSelected={addProductToSelected}
                            selectedProducts={selectedProducts}
                        />
                    )}

                    {showSaveButton && (
                        <Button onClick={() => backToInitialProducts()}>
                            Cancel changes
                        </Button>
                    )}
                    <Button onClick={editButtonHandler}>
                        {editMode ? 'Back' : 'Edit menu'}
                    </Button>

                    {editMode && (
                        <Button
                            onClick={() => dispatch({ type: 'SHOW_SEARCH' })}
                        >
                            Add
                        </Button>
                    )}

                    {showSaveButton && (
                        <Button onClick={saveHandler}>
                            {initialLoading ? 'Loading...' : 'Save changes'}
                        </Button>
                    )}
                </div>
            )}

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

            <Button onClick={() => removeMenu(menu.id)}>Delete menu</Button>

            <h2>{menu.name}</h2>

            <Table data={totalNutrients}></Table>
        </div>
    )
}

export default OneMenu
