import { useProductStore } from '@data/products'
import { useUserStore } from '@data/user'
import AddMenuForm from '@forms/AddMenuForm'
import { renderHook } from '@testing-library/react'
import { useOneMenu } from './useOneMenu'

describe('One menu hook', () => {
    test('Request with token, should return user data', async () => {
        const {
            result: {
                current: { menus, patchMenu, removeMenu, user, addMenu },
            },
        } = renderHook(() =>
            useUserStore(
                (state) => ({
                    menus: state.menus,
                    removeMenu: state.removeMenu,
                    patchMenu: state.patchMenu,
                    user: state.user,
                    addMenu: state.addMenu,
                })
                // shallow
            )
        )

        const {
            result: {
                current: { products, fetchSelectedProductsFullData },
            },
        } = renderHook(() =>
            useProductStore(
                (state) => ({
                    products: state.products,
                    fetchSelectedProductsFullData:
                        state.fetchSelectedProductsFullData,
                })
                // shallow
            )
        )

        addMenu(mockMenu)

        renderHook(() =>
            useOneMenu({
                menu: mockMenu,
                products,
                fetchSelectedProductsFullData,
            })
        )
    })
})

var mockMenu: Products.Menu = {
    name: '23131',
    id: 42,
    products: {
        262: {
            id: 262,
            name: 'bananas',
            category: 'fruits',
            state: 'fresh',
            quantity: 11,
        },
        314: {
            id: 314,
            name: 'guava',
            category: 'exotic fruits and berries',
            state: 'fresh',
            quantity: 123,
        },
    },
    description: 'some description',
    nutrients: {
        protein: {
            name: 'protein',
            value: 3.3,
            unit: 'g',
        },
        fat: {
            name: 'fat',
            value: 1.23,
            unit: 'g',
        },
        carbohydrate: {
            name: 'carbohydrate',
            value: 19.79,
            unit: 'g',
        },
        'vitamin a': {
            name: 'vitamin a',
            value: 39.05,
            unit: 'µg',
        },
        'beta carotene': {
            name: 'beta carotene',
            value: 460.46,
            unit: 'µg',
        },
        'alpha carotene': {
            name: 'alpha carotene',
            value: 2.79,
            unit: 'µg',
        },
        'vitamin d': {
            name: 'vitamin d',
            value: 0,
            unit: 'µg',
        },
        'vitamin d2': {
            name: 'vitamin d2',
            value: 0,
            unit: 'µg',
        },
        'vitamin d3': {
            name: 'vitamin d3',
            value: 0,
            unit: 'µg',
        },
        'vitamin e': {
            name: 'vitamin e',
            value: 0.89,
            unit: 'mg',
        },
        'vitamin k': {
            name: 'vitamin k',
            value: 3.31,
            unit: 'µg',
        },
        'vitamin c': {
            name: 'vitamin c',
            value: 284.91,
            unit: 'mg',
        },
        'vitamin b1': {
            name: 'vitamin b1',
            value: 0.09,
            unit: 'mg',
        },
        'vitamin b2': {
            name: 'vitamin b2',
            value: 0.06,
            unit: 'mg',
        },
        'vitamin b3': {
            name: 'vitamin b3',
            value: 1.39,
            unit: 'mg',
        },
        'vitamin b4': {
            name: 'vitamin b4',
            value: 10.48,
            unit: 'mg',
        },
        'vitamin b5': {
            name: 'vitamin b5',
            value: 0.58,
            unit: 'mg',
        },
        'vitamin b6': {
            name: 'vitamin b6',
            value: 0.17,
            unit: 'mg',
        },
        'vitamin b9': {
            name: 'vitamin b9',
            value: 62.93,
            unit: 'µg',
        },
        'vitamin b12': {
            name: 'vitamin b12',
            value: 0,
            unit: 'µg',
        },
        calcium: {
            name: 'calcium',
            value: 22.44,
            unit: 'mg',
        },
        iron: {
            name: 'iron',
            value: 0.34,
            unit: 'mg',
        },
        magnesium: {
            name: 'magnesium',
            value: 29.87,
            unit: 'mg',
        },
        phosphorus: {
            name: 'phosphorus',
            value: 51.67,
            unit: 'mg',
        },
        potassium: {
            name: 'potassium',
            value: 559.72,
            unit: 'mg',
        },
        sodium: {
            name: 'sodium',
            value: 2.6,
            unit: 'mg',
        },
        zinc: {
            name: 'zinc',
            value: 0.3,
            unit: 'mg',
        },
        copper: {
            name: 'copper',
            value: 0.29,
            unit: 'mg',
        },
        manganese: {
            name: 'manganese',
            value: 0.21,
            unit: 'mg',
        },
        selenium: {
            name: 'selenium',
            value: 0.85,
            unit: 'µg',
        },
        fluoride: {
            name: 'fluoride',
            value: 0.24,
            unit: 'µg',
        },
        water: {
            name: 'water',
            value: 107.85,
            unit: 'g',
        },
        fiber: {
            name: 'fiber',
            value: 6.84,
            unit: 'g',
        },
        sugar: {
            name: 'sugar',
            value: 12.43,
            unit: 'g',
        },
        energy: {
            name: 'energy',
            value: 93.18,
            unit: 'kcal',
        },
    },
}
