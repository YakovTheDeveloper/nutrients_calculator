import { PatchMenuConfig } from '@data/user'
import { Updater } from 'use-immer'
import { MenuAction, MenuReducerState } from './useMenuControls'

export async function saveHandler(
    dispatch: (value: MenuAction) => void,
    patchMenuHandler: (config: PatchMenuConfig) => Promise<void>,
    config: PatchMenuConfig
) {
    dispatch({ type: 'InitialLoadingOn' })
    await patchMenuHandler(config)
    dispatch({ type: 'InitialLoadingOff' })
    dispatch({ type: 'EDIT_MODE_OFF' })
}

export interface EditAction {
    dispatch: (value: MenuAction) => void
    controlsState: MenuReducerState
    menu: Products.Menu
    setSelectedProducts: Updater<Products.Selected>
    selectedProducts: Products.Selected
    initialProductsFetch: (
        selectedProducts: Products.Selected,
        dispatch: (value: MenuAction) => void
    ) => Promise<void>
}

export function editButtonHandler({
    controlsState,
    dispatch,
    menu,
    setSelectedProducts,
    initialProductsFetch,
    selectedProducts,
}: EditAction) {
    if (controlsState.editMode) {
        dispatch({ type: 'EDIT_MODE_OFF' })
        setSelectedProducts(() => menu.products)
        return
    }
    initialProductsFetch(selectedProducts, dispatch)
    dispatch({ type: 'EDIT_MODE_ON' })
}

export function backToInitialProducts(
    dispatch: (value: MenuAction) => void,
    setSelectedProducts: Updater<Products.Selected>,
    menu: Products.Menu
) {
    dispatch({ type: 'EDIT_MODE_OFF' })
    setSelectedProducts(() => menu.products)
}
