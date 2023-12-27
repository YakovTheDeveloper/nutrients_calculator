import React, { useEffect, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';

import { fetchProductsByNutrient } from '@api/methods';

import ProductTierContent from '../productTierContent/productTierContent';
import { ProductTierContentHeading } from '../productTierContent/productTierContentHeading';

type Props = {
	nutrientId: number;
};

const ProductNutrientContentFetched = ({ nutrientId }: Props) => {
	const [products, setProducts] = useState<Products.ItemWithNoNutrients[]>([]);

	const SWRKey = `/nutrients/${nutrientId}`;

	const fetcher = () => fetchProductsByNutrient({ nutrient_id: nutrientId });

	const { data, isLoading } = useSWR(SWRKey, fetcher, {
		// revalidateOnFocus: true,
	});

	useEffect(() => {
		if (!data?.result) {
			return;
		}
		setProducts(data.result);
	}, [data]);

	return (
		<div>
			<ProductTierContentHeading isLoading={isLoading} />
			<ProductTierContent products={products} />
		</div>
	);
};

const ProductNutrientContentContainer = ({ nutrientId }: Props) => {
	const { cache } = useSWRConfig();

	const SWRKey = `/nutrients/${nutrientId}`;

	const cachedValue = cache.get(SWRKey)?.data?.result;

	if (cachedValue) {
		return (
			<div>
				<h2>Cached</h2>
				<ProductTierContentHeading />
				<ProductTierContent products={cachedValue} />
			</div>
		);
	}

	return <ProductNutrientContentFetched nutrientId={nutrientId} />;
};

export default ProductNutrientContentContainer;
