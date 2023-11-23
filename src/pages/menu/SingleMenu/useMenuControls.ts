import { SingleMenuProps } from '../index'
import { useImmerReducer } from 'use-immer'
import { useLayoutEffect } from 'react'

export type MenuReducerState = {
    initialLoading: boolean
    editMode: boolean
    showSearch: boolean
    showSaveButton: boolean
    menuName: string
    menuNameLoading: boolean
    initialMenuName: string
    showDescription: boolean
    description: string
    initialMenuDescription: string
    changeName: boolean
    changeDescription: boolean
    errorMessage: string
}

export type MenuAction =
    | { type: 'InitialLoadingOff' }
    | { type: 'InitialLoadingOn' }
    | { type: 'SAVE_CHANGES_CLEANUP' }
    | { type: 'EDIT_MODE_ON' }
    | { type: 'EDIT_MODE_OFF' }
    | { type: 'SHOW_SEARCH' }
    | { type: 'CLOSE_SEARCH' }
    | { type: 'SHOW_SAVE_BUTTON' }
    | { type: 'HIDE_SAVE_BUTTON' }
    | { type: 'CHANGE_MENU_NAME'; payload: string }
    | { type: 'CHANGE_MENU_DESCRIPTION'; payload: string }
    | { type: 'TOGGLE_MENU_NAME_CHANGE' }
    | { type: 'TOGGLE_MENU_DESCRIPTION_CHANGE' }
    | { type: 'UNDO_MENU_DESCRIPTION_CHANGES' }
    | { type: 'UNDO_MENU_NAME_CHANGES' }
    | { type: 'TOGGLE_ERROR_MESSAGE' }
    | { type: 'TOGGLE_DESCRIPTION' }

function reducer(state: MenuReducerState, action: MenuAction) {
    if (action.type === 'InitialLoadingOn') state.initialLoading = true
    if (action.type === 'InitialLoadingOff') state.initialLoading = false
    if (action.type === 'EDIT_MODE_OFF') {
        state.editMode = false
        state.showSearch = false
        state.showSaveButton = false
    }
    if (action.type === 'EDIT_MODE_ON') state.editMode = true
    if (action.type === 'SHOW_SEARCH') state.showSearch = true
    if (action.type === 'SHOW_SAVE_BUTTON') state.showSaveButton = true
    if (action.type === 'HIDE_SAVE_BUTTON') state.showSaveButton = false
    if (action.type === 'TOGGLE_DESCRIPTION')
        state.showDescription = !state.showDescription
    if (action.type === 'CHANGE_MENU_NAME') state.menuName = action.payload
    if (action.type === 'UNDO_MENU_NAME_CHANGES') {
        state.menuName = state.initialMenuName
        state.changeName = false
    }

    if (action.type === 'CHANGE_MENU_DESCRIPTION')
        state.description = action.payload
    if (action.type === 'UNDO_MENU_DESCRIPTION_CHANGES')
        state.description = state.initialMenuDescription
    if (action.type === 'TOGGLE_MENU_NAME_CHANGE')
        state.changeName = !state.changeName
    if (action.type === 'TOGGLE_ERROR_MESSAGE')
        state.errorMessage = state.errorMessage
            ? ''
            : 'Sorry, there was an error ;( Try again later'
    if (action.type === 'TOGGLE_MENU_DESCRIPTION_CHANGE')
        state.changeDescription = !state.changeDescription
    return state
}

type MenuControlsProps = {
    menu: SingleMenuProps['menu']
    // products: SingleMenuProps['products']
    selectedProducts: Products.Selected
    atLeastOneLoadingProduct: boolean
    changeOccured: boolean
}

export const useMenuControls = ({
    menu,
    selectedProducts,
    atLeastOneLoadingProduct,
    changeOccured,
}: MenuControlsProps) => {
    const initialState: MenuReducerState = {
        initialLoading: false,
        editMode: false,
        showSearch: false,
        showSaveButton: false,
        menuName: menu.name,
        initialMenuName: menu.name,
        description: menu.description,
        initialMenuDescription: menu.description,
        changeName: false,
        changeDescription: false,
        menuNameLoading: false,
    }
    const [controlsState, dispatch] = useImmerReducer(reducer, initialState)

    useLayoutEffect(() => {
        // why fetch all data if i just need to change name or description?
        if (atLeastOneLoadingProduct || !changeOccured) {
            dispatch({ type: 'HIDE_SAVE_BUTTON' })
            return
        }
        dispatch({ type: 'SHOW_SAVE_BUTTON' })
    }, [selectedProducts])

    return {
        controlsState,
        dispatch,
    }
}
