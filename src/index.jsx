import React from 'react';
import { createRoot } from 'react-dom/client'
import { App } from './App'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Menu from '@pages/menu'
import Layout from '@layout/Layout';
import ProductPage from '@pages/product';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <App />,
            },
            {
                path: "/menu",
                element: <Menu />,
            },
            {
                path: "/product/:id",
                element: <ProductPage />,
            },
        ],
    },

])

const domNode = document.getElementById('root')

const root = createRoot(domNode)
root.render(<RouterProvider router={router} />)

if (module.hot) {
    module.hot.accept()
}

// root.render()