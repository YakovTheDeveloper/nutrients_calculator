import React, { memo } from 'react';

import { colorFoodHighlight } from '@constants/colors';
import { useModalStore } from '@data/modal';
import { Button, ButtonTypes } from '@ui/Button';
import Table from '@ui/Nutrients2/Table';

import { ProductInfo } from '../../../components/modals/ProductInfo';

const ProductTierContent = memo(({ products = [] }) => {
	const openModal = useModalStore((state) => state.openModal);

	const onItemClick = (product: Products.ItemWithNoNutrients) => openModal(<ProductInfo product={product} />);

	return (
		<div>
			<Table
				data={products}
				heading={null}
				columns={[
					{ key: 'name', label: 'Name' },
					{ key: 'description', label: 'Description' },
					{ key: 'quantity', label: 'Amount' },
					{ key: 'action', label: '' },
				]}
				render={{
					action: (data) => (
						<Button.ToggleAddProduct
							productId={data.id}
							toggleBetween={{
								add: ButtonTypes.ghost,
								added: ButtonTypes.tertiary,
							}}
						/>
					),
					name: (data) => (
						<div
							// className={s.productTiers__product}
							onClick={() => onItemClick(data)}
						>
							{data?.name}
						</div>
					),
					quantity: (data) => (
						<span>
							{data?.quantity} {data?.unit_name?.toLowerCase()}
						</span>
					),
				}}
				emptyPlaceholder={'N/A'}
				highlight={{
					color: colorFoodHighlight,
				}}
			/>
		</div>
	);
});

export default ProductTierContent;
