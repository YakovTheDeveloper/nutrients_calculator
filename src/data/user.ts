import { SelectedProduct } from '../types/declaration';
import { removeToken } from '@api/localStorage';
import { IdToValueMapping } from '@api/methods';
import { ReactNode } from 'react';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { isEmpty } from '@helpers/isEmpty';
import { immer } from 'zustand/middleware/immer';

export type PatchMenuConfig = {
    id: number
    idToQuantityMapping?: IdToValueMapping
    newProducts?: Products.Selected
    name?: string
    description?: string
}

type PatchMenuProductsUpdate = {
    type: 'add' | 'modify'
    menuId: number
    productId: number
    value: number | string
}

type PatchMenuProductsDelete = {
    type: 'delete'
    menuId: number
    productId: number
}
type PatchMenuConfig2 = PatchMenuProductsDelete | PatchMenuProductsUpdate
type PatchMenuConfig3 =
    | Omit<PatchMenuProductsDelete, 'menuId'>
    | Omit<PatchMenuProductsUpdate, 'menuId'>

export interface State {
    user: Pick<Api.User, 'data'> | null;
    initialMenuSnapshot: Products.Menu[];
    mainPageMenu: Products.Menu;
    menus: Products.Menu[];
    currentMenuId: number;
}

export interface Actions {
    setUser: (user: Pick<Api.User, 'data'>) => void;
    removeUser: () => void;
    clearMainPageMenu: () => void;
    setMenus: (menus: Products.Menu[]) => void;
    setCurrentMenuId: (id: number) => void;
    addMenu: (menu: Products.Menu) => void;
    removeMenu: (id: number) => void;
    patchMenu: (config: PatchMenuConfig) => void;
    updateMenu: (id: number, newMenu: Products.Menu) => void;
    patchMenuProducts: (config: PatchMenuConfig2) => void;
    patchMainPageMenuProducts: (config: PatchMenuConfig3) => void;
    isProductInMainMenu: (id: number) => boolean;
    clearStore: () => void;
}


const initialState: State = {
    user: null,
    currentMenuId: -1,
    mainPageMenu: {
        description: '',
        id: -1,
        name: '',
        products: {}
    },
    menus: [],
    initialMenuSnapshot: []
};

export const useUserStore = create<Actions & State>()(
    devtools(
        immer((set, get) => ({
            ...initialState,
            setUser: (user) =>
                set((state) => ({
                    ...state,
                    user
                })),
            removeUser: () =>
                set((state) => {
                    removeToken();
                    return { ...state, user: null };
                }),
            setMenus: (menus: Products.Menu[]) =>
                set((state) => {
                    return { ...state, menus, initialMenuSnapshot: [...menus] };
                }),
            addMenu: (menu: Products.Menu) =>
                set((state) => {
                    state.menus.push(menu);
                    // const menusWithNew = [...state.menus, menu]
                    // return { ...state, menus: menusWithNew }
                }),
            removeMenu: (id: number) =>
                set((state) => {
                    const index = state.menus.findIndex(
                        (menu) => menu.id === id
                    );
                    state.menus.splice(index, 1);
                }),
            updateMenu: (id: number, menu: Products.Menu) =>
                set((state) => {
                    const index = state.menus.findIndex(
                        (menu) => menu.id === id
                    );
                    state.initialMenuSnapshot[index] = { ...menu };
                }),
            patchMenuProducts: (data) =>
                set((state) => {
                    const menu = state.menus.find(
                        (menu) => menu.id === data.menuId
                    );
                    if (!menu) return;
                    if (data.type === 'modify' || data.type === 'add') {
                        menu.products[data.productId] = +data.value;
                    }
                    if (data.type === 'delete') {
                        console.log('should delete');
                        delete menu.products[data.productId];
                    }
                }),
            patchMainPageMenuProducts: (data) =>
                set((state) => {
                    console.log('should delete', data);

                    if (data.type === 'modify' || data.type === 'add') {
                        state.mainPageMenu.products[data.productId] =
                            +data.value;
                    }
                    if (data.type === 'delete') {
                        console.log('should delete');
                        delete state.mainPageMenu.products[data.productId];
                    }
                }),
            clearMainPageMenu: () =>
                set((state) => {
                    state.mainPageMenu = initialState.mainPageMenu;
                }),
            isProductInMainMenu: (id) => {
                return id in get().mainPageMenu.products;
            },
            patchMenu: ({
                id,
                idToQuantityMapping,
                newProducts,
                description,
                name
            }) =>
                set((state) => {
                    const menu = state.menus.find(
                        (menu: Products.Menu) => menu.id === id
                    );
                    if (!menu) return state;

                    if (name) menu.name = name;
                    if (description) menu.description = description;

                    if (idToQuantityMapping)
                        for (const [id, quantity] of Object.entries(
                            idToQuantityMapping
                        )) {
                            const product = menu.products[+id];
                            if (!product) continue;
                            if (quantity === 0) {
                                // menu.products[+id] = null
                                delete menu.products[+id];
                                continue;
                            }
                            product.quantity = quantity;
                        }

                    if (newProducts && isEmpty(newProducts) === false) {
                        for (const [id, product] of Object.entries(newProducts))
                            if (product.quantity > 0)
                                menu.products[+id] = product;
                    }

                    // return state
                    // const menu = state.menus[id].products
                }),
            clearStore: () =>
                set((state) => {
                    removeToken();
                    return {
                        ...state,
                        user: null,
                        menus: []
                    };
                }),
            setCurrentMenuId: (id: number) =>
                set((state) => {
                    state.currentMenuId = id;
                }),

        })),
        {
            name: 'user-storage',
            serialize: {
                options: {
                    map: true
                }
            } as any
        }
    )
);
// import { SelectedProduct } from './../types/index.d'
// import { removeToken } from '@api/localStorage'
// import { IdToValueMapping } from '@api/methods'
// import { ReactNode } from 'react'
// import { create } from 'zustand'
// import { devtools, persist } from 'zustand/middleware'
// import { isEmpty } from '@helpers/isEmpty'
// import { immer } from 'zustand/middleware/immer'

// export type PatchMenuConfig = {
//     id: number
//     idToQuantityMapping?: IdToValueMapping
//     newProducts?: Products.Selected
//     name?: string
//     description?: string
// }

// export interface UserState {
//     user: Pick<Api.User, 'data'> | null
//     setUser: (user: Pick<Api.User, 'data'>) => void
//     removeUser: () => void
//     menus: Products.Menu[]
//     setMenus: (menus: Products.Menu[]) => void
//     addMenu: (menu: Products.Menu) => void
//     removeMenu: (id: number) => void
//     patchMenu: (config: PatchMenuConfig) => void
//     clearStore: () => void
// }

// export const useUserStore = create<UserState>()(
//     devtools(
//         immer((set, get) => ({
//             user: null,
//             menus: [],
//             setUser: (user) =>
//                 set((state) => ({
//                     ...state,
//                     user,
//                 })),
//             removeUser: () =>
//                 set((state) => {
//                     removeToken()
//                     return { ...state, user: null }
//                 }),
//             setMenus: (menus: Products.Menu[]) =>
//                 set((state) => {
//                     return { ...state, menus }
//                 }),
//             addMenu: (menu: Products.Menu) =>
//                 set((state) => {
//                     const menusWithNew = [...state.menus, menu]
//                     return { ...state, menus: menusWithNew }
//                 }),
//             removeMenu: (id: number) =>
//                 set((state) => {
//                     const index = state.menus.findIndex(
//                         (menu) => menu.id === id
//                     )
//                     state.menus.splice(index, 1)
//                 }),
//             patchMenu: ({
//                 id,
//                 idToQuantityMapping,
//                 newProducts,
//                 description,
//                 name,
//             }) =>
//                 set((state) => {
//                     const menu = state.menus.find(
//                         (menu: Products.Menu) => menu.id === id
//                     )
//                     if (!menu) return state

//                     if (name) menu.name = name
//                     if (description) menu.description = description

//                     if (idToQuantityMapping)
//                         for (const [id, quantity] of Object.entries(
//                             idToQuantityMapping
//                         )) {
//                             const product = menu.products[+id]
//                             if (!product) continue
//                             if (quantity === 0) {
//                                 // menu.products[+id] = null
//                                 delete menu.products[+id]
//                                 continue
//                             }
//                             product.quantity = quantity
//                         }

//                     if (newProducts && isEmpty(newProducts) === false) {
//                         for (const [id, product] of Object.entries(newProducts))
//                             if (product.quantity > 0)
//                                 menu.products[+id] = product
//                     }

//                     // return state
//                     // const menu = state.menus[id].products
//                 }),
//             clearStore: () =>
//                 set((state) => {
//                     removeToken()
//                     return {
//                         ...state,
//                         user: null,
//                         menus: [],
//                     }
//                 }),
//             // patchMenu: (id, idToQuantityMapping, newProducts) =>
//             //     set((state) => {
//             //         console.log('@@', newProducts)
//             //         const menusWithPatched = state.menus.map((menu) => {
//             //             if (menu.id !== id) return menu
//             //             const newMenu = { ...menu }
//             //             for (const productId in menu.products) {
//             //                 if (productId in idToQuantityMapping) {
//             //                     const quantity = idToQuantityMapping[productId]
//             //                     if (quantity === 0)
//             //                         delete newMenu.products[+productId]
//             //                     else
//             //                         newMenu.products[+productId].quantity =
//             //                             quantity
//             //                 }
//             //             }

//             //             if (newProducts && isEmpty(newProducts) === false) {
//             //                 newMenu.products = {
//             //                     ...newMenu.products,
//             //                     ...newProducts,
//             //                 }
//             //             }

//             //             return newMenu
//             //         })
//             //         console.log('menusWithPatched', menusWithPatched)
//             //         return { ...state, menus: menusWithPatched }
//             //     }),
//         })),
//         {
//             name: 'user-storage',
//             serialize: {
//                 options: {
//                     map: true,
//                 },
//             } as any,
//         }
//     )
// )
