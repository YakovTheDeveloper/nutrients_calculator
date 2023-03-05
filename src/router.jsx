import React from 'react'
import { App } from './App'
import { createBrowserRouter } from 'react-router-dom'
import Menu from '@pages/menu'
import Layout from '@layout/Layout'
import ProductPage from '@pages/product'
import ProductsTier from '@pages/productsTier'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '/',
                element: <App />,
            },
            {
                path: '/menu',
                element: <Menu />,
            },
            {
                path: '/product/:id',
                element: <ProductPage />,
            },
            {
                path: '/product/:id',
                element: <ProductPage />,
            },
            {
                path: '/productsTier',
                element: <ProductsTier />,
            },
        ],
    },
])
