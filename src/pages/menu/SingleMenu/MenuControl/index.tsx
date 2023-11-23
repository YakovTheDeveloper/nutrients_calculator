import { IdToValueMapping } from '@api/methods'
import { PatchMenuConfig } from '@data/user'
import {Button} from '@ui/Button'
import React from 'react'
import { Updater } from 'use-immer'
import { EditAction } from '../controlsMethods'
import { MenuAction, MenuReducerState } from '../useMenuControls'
import styles from './index.module.scss'

type MenuControlProps = {
    dispatch: React.Dispatch<MenuAction>
    controlsState: MenuReducerState
    saveHandler: (
        dispatch: (value: MenuAction) => void,
        patchMenuHandler: (config: PatchMenuConfig) => Promise<void>,
        config: PatchMenuConfig
    ) => Promise<void>
    patchMenuHandler: (config: PatchMenuConfig) => Promise<boolean>
    totalIdToQuantityMapping: IdToValueMapping
    selectedProducts: Products.Selected
    menu: Products.Menu
    editButtonHandler: ({
        menu,
        dispatch,
        controlsState,
        selectedProducts,
        setSelectedProducts,
        initialProductsFetch,
    }: EditAction) => void
    setSelectedProducts: Updater<Products.Selected>

    setGlobalSelectedProducts: (product: Products.Selected) => void
    initialProductsFetch: (selectedProducts: Products.Selected) => Promise<void>
}

const MenuControl = ({
    dispatch,
    controlsState,
    setGlobalSelectedProducts,
    editButtonHandler,
    saveHandler,
    patchMenuHandler,
    totalIdToQuantityMapping,
    selectedProducts,
    initialProductsFetch,
    setSelectedProducts,
    menu,
}: MenuControlProps) => {
    const { editMode, initialLoading } = controlsState

    return (
        <>
            <div className={styles.menuNameAndEditContainer}>
                <Button
                    onClick={() =>
                        editButtonHandler({
                            dispatch,
                            controlsState,
                            selectedProducts,
                            initialProductsFetch,
                            setSelectedProducts,
                            menu,
                        })
                    }
                    bordered
                    size="small"
                >
                    {editMode ? 'back' : 'edit'}
                </Button>
            </div>

            {editMode && (
                <Button
                    bordered
                    onClick={() => dispatch({ type: 'SHOW_SEARCH' })}
                    size="small"
                >
                    add
                </Button>
            )}

            <div className={styles.saveBtnContainer}>
                {controlsState.showSaveButton && (
                    <Button
                        onClick={() =>
                            saveHandler(dispatch, patchMenuHandler, {
                                id: menu.id,
                                idToQuantityMapping: totalIdToQuantityMapping,
                                newProducts: selectedProducts,
                                name: controlsState.menuName,
                                description: controlsState.description,
                            })
                        }
                        bordered
                        size="small"
                    >
                        {initialLoading ? 'Loading...' : 'save changes'}
                    </Button>
                )}
            </div>

            <Button
                bordered
                size="small"
                onClick={() => setGlobalSelectedProducts(selectedProducts)}
            >
                copy to search page
            </Button>
        </>
    )
}

export default MenuControl
