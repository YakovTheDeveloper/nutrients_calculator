import React from 'react';

import { useProductTierStore } from '@data/productTierStore';
import { Loader, LoaderSize } from '@ui/Loader';

const ProductTierContentHeading = ({ isLoading = false }) => {
	const currentNutrient = useProductTierStore((s) => s.currentNutrient);

	return (
		<div className={''}>
			<span>Products {currentNutrient && <span>{currentNutrient?.name}</span>}</span>
			{isLoading && <Loader size={LoaderSize.large} />}
		</div>
	);
};

export default ProductTierContentHeading;
