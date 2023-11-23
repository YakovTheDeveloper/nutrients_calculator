import React, { useEffect } from 'react'
import { ProductState } from '@data/products'
import { PatchMenuConfig } from '@data/user'
import {Button} from '@ui/Button'
import SelectedProducts from '@ui/SelectedProducts'
import Table from '@ui/Table'
import Search from '@ui/Search'
import styles from './index.module.scss'
import { UserState } from '@data/user'
import { useMenuProducts } from './useMenuProducts'
import Loader from '@ui/Loader/Loader'
import { useMenuControls } from './useMenuControls'
import MenuControl from './MenuControl'
import { editButtonHandler, saveHandler } from './controlsMethods'
import { useCalculateNutrients } from './useCalculateNutrients'
import { wait } from '@helpers/wait'
import { EMOJI } from '@constants/misc'
import EditableText from './EditableText'

export type SingleMenuProps = {
    menu: Products.Menu
    removeMenu: UserState['removeMenu']
    patchMenuHandler: (
        config: PatchMenuConfig,
        order: 'fetchFirst' | 'storeFirst'
    ) => Promise<boolean>
    // patchMenuHandler: UserState['patchMenu']
    products: Products.IdToItemMapping
    fetchSelectedProductsFullData: ProductState['fetchSelectedProductsFullData']
    setGlobalSelectedProducts: ProductState['setSelectedProducts']
}

const SingleMenu = ({
    menu,
    removeMenu,
    patchMenuHandler,
    products,
    fetchSelectedProductsFullData,
    setGlobalSelectedProducts,
}: SingleMenuProps) => {
    const {
        selectedProducts,
        addProductToSelected,
        removeProductFromSelected,
        setProductQuantity,
        setSelectedProducts,
        initialProductsFetch,
        atLeastOneLoadingProduct,
        getProductChangingsToPatch,
    } = useMenuProducts({
        menu,
        products,
        fetchSelectedProductsFullData,
    })

    const { changeOccured, totalIdToQuantityMapping } =
        getProductChangingsToPatch(menu, selectedProducts)

    const { controlsState, dispatch } = useMenuControls({
        atLeastOneLoadingProduct,
        changeOccured,
        menu,
        selectedProducts,
    })

    const changeName = async (name: string) => {
        const result = patchMenuHandler(
            {
                id: menu.id,
                name,
            },
            'storeFirst'
        )
        dispatch({ type: 'TOGGLE_MENU_NAME_CHANGE' })
        const status = await result

        if (!status) {
            dispatch({ type: 'TOGGLE_MENU_NAME_CHANGE' })
            dispatch({ type: 'TOGGLE_ERROR_MESSAGE' })
            await wait(5000)
            dispatch({ type: 'TOGGLE_ERROR_MESSAGE' })
        }
    }
    const changeDescription = async (description: string) => {
        const result = patchMenuHandler(
            {
                id: menu.id,
                description,
            },
            'storeFirst'
        )
        dispatch({ type: 'TOGGLE_MENU_DESCRIPTION_CHANGE' })
        const status = await result

        if (!status) {
            dispatch({ type: 'TOGGLE_MENU_DESCRIPTION_CHANGE' })
            dispatch({ type: 'TOGGLE_ERROR_MESSAGE' })
            await wait(5000)
            dispatch({ type: 'TOGGLE_ERROR_MESSAGE' })
        }
    }

    useEffect(() => {
        console.log('controlsState.description', controlsState.description)
    }, [controlsState])

    const { totalNutrients } = useCalculateNutrients({
        controlsState,
        menu,
        products,
        selectedProducts,
    })

    return (
        <div className={styles.container}>
            <h1>{controlsState.initialLoading && <Loader />}</h1>
            {!controlsState.initialLoading && (
                <div className={styles.buttonPanel}>
                    {controlsState.showSearch && (
                        <Search
                            addProductToSelected={addProductToSelected}
                            selectedProducts={selectedProducts}
                        />
                    )}
                    <p>{controlsState.errorMessage}</p>

                    <EditableText
                        initValue={menu.name}
                        value={controlsState.menuName}
                        editMode={controlsState.changeName}
                        makeChange={() => changeName(controlsState.menuName)}
                        onTextEdit={(value) =>
                            dispatch({
                                type: 'CHANGE_MENU_NAME',
                                payload: value,
                            })
                        }
                        toggleEditMode={() =>
                            dispatch({
                                type: 'TOGGLE_MENU_NAME_CHANGE',
                            })
                        }
                        undo={() =>
                            dispatch({
                                type: 'UNDO_MENU_NAME_CHANGES',
                            })
                        }
                    >
                        {controlsState.menuName}
                    </EditableText>
                    {/* 
                    <input
                        type="checkbox"
                        onClick={() => dispatch({ type: 'TOGGLE_DESCRIPTION' })}
                    >
                    </input> */}
                    <label htmlFor="state">
                        <div>
                            {' '}
                            {controlsState.showDescription && '^'} description
                        </div>
                        <input
                            type="checkbox"
                            id="state"
                            hidden
                            className={styles.checkbox}
                        ></input>
                    </label>

                    {
                        <EditableText
                            wrapperClassName={styles.description}
                            initValue={menu.description}
                            value={controlsState.description}
                            editMode={controlsState.changeDescription}
                            makeChange={() =>
                                changeDescription(controlsState.description)
                            }
                            onTextEdit={(value) =>
                                dispatch({
                                    type: 'CHANGE_MENU_DESCRIPTION',
                                    payload: value,
                                })
                            }
                            toggleEditMode={() =>
                                dispatch({
                                    type: 'TOGGLE_MENU_DESCRIPTION_CHANGE',
                                })
                            }
                            undo={() =>
                                dispatch({
                                    type: 'UNDO_MENU_DESCRIPTION_CHANGES',
                                })
                            }
                        >
                            {controlsState.description || 'No description yet'}
                        </EditableText>
                    }

                    <MenuControl
                        controlsState={controlsState}
                        dispatch={dispatch}
                        patchMenuHandler={patchMenuHandler}
                        totalIdToQuantityMapping={totalIdToQuantityMapping}
                        editButtonHandler={editButtonHandler}
                        setGlobalSelectedProducts={setGlobalSelectedProducts}
                        setSelectedProducts={setSelectedProducts}
                        menu={menu}
                        selectedProducts={selectedProducts}
                        saveHandler={saveHandler}
                        initialProductsFetch={initialProductsFetch}
                    />
                </div>
            )}

            <SelectedProducts
                editMode={controlsState.editMode}
                products={selectedProducts}
                remove={removeProductFromSelected}
                setQuantity={setProductQuantity}
            />

            <Table data={totalNutrients}></Table>
            <Button onClick={() => removeMenu(menu.id)} bordered size="medium">
                delete {menu.name}
            </Button>
        </div>
    )
}

export default SingleMenu
