import React from "react";
import { App } from "./App";
import { createBrowserRouter } from "react-router-dom";
import Layout from "@layout/Layout";
import ProductPage from "@pages/product";
import ProductsTier from "@pages/productsTier";
import SearchAndCalculate from "@pages/searchAndCalculate";
import { CreateProduct } from "@pages/createProduct";
import { MyProducts } from "@pages/myProducts";
import { Settings } from "@pages/settings";
import { NutrientNorms } from "@pages/nutrientNorms";
import { MenuPage } from "@pages/menu";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <SearchAndCalculate />
            },
            {
                path: "/menu",
                element: <MenuPage />
            },
            {
                path: "/products_tier",
                element: <ProductsTier />
            },
            {
                path: "/my_products",
                element: <MyProducts />
            },
            {
                path: "/create_product",
                element: <CreateProduct />
            },
            {
                path: "/settings",
                element: <Settings />
            },
            {
                path: "/settings/calculation",
                element: <NutrientNorms />
            }
        ]
    }
]);
