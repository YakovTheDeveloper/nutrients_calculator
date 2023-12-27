import React, { ReactElement } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import { useUserStore } from '@data/user';
import { CreateProduct } from '@pages/createProduct';
import { MenuPage } from '@pages/menu';
import { MyProducts } from '@pages/myProducts';
import { NutrientNorms } from '@pages/nutrientNorms';
import { ProductsTierPage } from '@pages/productsTier';
import SearchAndCalculate from '@pages/searchAndCalculate';
import { Settings } from '@pages/settings';

import { App } from './App';

type Props = {
	children: ReactElement;
};

const Protected = ({ children }: Props) => {
	const user = useUserStore((s) => s.user);

	return !user ? <Navigate to={'/'} replace /> : children;
};

export const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{
				path: '/',
				element: <SearchAndCalculate />,
			},
			{
				path: '/menu',
				element: <MenuPage />,
			},
			{
				path: '/products_tier',
				element: <ProductsTierPage />,
			},
			{
				path: '/my_products',
				element: (
					<Protected>
						<MyProducts />
					</Protected>
				),
			},
			{
				path: '/create_product',
				element: (
					<Protected>
						<CreateProduct />
					</Protected>
				),
			},
			{
				path: '/norms',
				element: <NutrientNorms />,
			},
			{
				path: '/settings',
				element: <Settings />,
			},
		],
	},
	{
		path: '*',
		element: <SearchAndCalculate />,
	},
]);
