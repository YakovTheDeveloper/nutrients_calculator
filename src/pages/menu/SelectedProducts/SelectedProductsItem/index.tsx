import { productIdToNameAndDescriptionMapping } from '@constants/products';
import { useProductStore } from '@data/products';
import Input from '@ui/Input/Input';
import React, { useRef, useState } from 'react';
import s from './SelectedProductsItem.module.scss';
import ClearButton from '@ui/Button/ClearButton';
import cn from 'classnames';
// import { RawIcon } from '@assets/icons'
import { ReactComponent as RawIcon } from '../../../../assets/icons/raw.svg';
import { SelectedProductsEnum, useSettings } from '@data/settings';
import { useModalStore } from '@data/modal';
import { ProductInfo } from '../../../../components/modals/ProductInfo';
import { useBaseProducts } from '@data/product/useBaseProducts';
// import { ReactComponent as RawIcon } from '@assets/icons/raw.svg'

type SelectedProductsItemProps = {
    id: string;
    quantity: number;
    children?: React.ReactNode;
    onProductDelete: (productId: number) => void;
    onProductValueChange: (value: string, productId: string) => void;
    type: SelectedProductsEnum;
    onTitleClick?: (product: Products.ItemWithNoNutrients) => void
};

const SelectedProductsItem = ({
	id,
	quantity,
	children,
	onProductValueChange,
	onProductDelete,
	type = SelectedProductsEnum.cards,
	onTitleClick
}: SelectedProductsItemProps) => {
	const { products } = useProductStore((state) => ({
		products: state.products
	}));
	const getProductMinimalData = useBaseProducts(s => s.getProductMinimalData);

	const onDelete = () => onProductDelete(id);

	const inputRef = useRef<HTMLInputElement | null>(null);

	// if(!productIdToNameAndDescriptionMapping[id]) return null
	const product = getProductMinimalData(id);
	if (!product) return;

	const { name, description } = product;


	const isRaw = description.includes('green');

	const noProductLoadYet = !products[id];

	const titleClickHandler = (event: React.MouseEvent) => {
		event.stopPropagation();

		onTitleClick?.({
			name,
			description,
			id
		});
	};

	const onItemClick = () => {
		inputRef.current?.focus();
	};

	if (type === 'list')
		return (
			<li
				className={cn(
					s.selectedProduct,
					s.selectedProduct_listItem,
					isRaw && s.selectedProductListItem_raw,
					noProductLoadYet && s.selectedProduct_loading
				)}
				onClick={onItemClick}
			>
				<div className={s.selectedProduct__inputContainer}>
					<Input
						ref={inputRef}
						disabled={noProductLoadYet}
						className={s.selectedProduct__input}
						value={quantity.toString()}
						type="number"
						onChange={(e) => onProductValueChange(e.target.value, id)}
					/>
				</div>
				<p className={s.selectedProduct__name} onClick={titleClickHandler}>
					{name}
				</p>

				<p
					className={s.selectedProduct__description}
					onClick={event => event.stopPropagation()}
				>{description.join(', ')}</p>
				<ClearButton
					onClick={onDelete}
					className={s.selectedProduct__deleteButton}
				/>
			</li>
		);

	return (
		<li
			className={cn(
				s.selectedProduct,
				s.selectedProduct_card,
				isRaw && s.selectedProductCardItem_raw,
				noProductLoadYet && s.selectedProduct_loading

			)}
			onClick={onItemClick}
		>
			<p onClick={titleClickHandler} className={s.selectedProduct__name}>
				{name}
			</p>
			<p
				className={s.selectedProduct__description}
				onClick={event => event.stopPropagation()}
			>
				{description.join(', ')}
			</p>
			<div className={s.selectedProduct__inputContainer}>
				<Input
					ref={inputRef}
					disabled={noProductLoadYet}
					className={s.selectedProduct__input}
					value={quantity.toString()}
					type="number"
					onChange={(e) => onProductValueChange(e.target.value, id)}
				/>
				<div className={s.selectedProduct_card__iconBar}>
					{isRaw && <RawIcon />}
				</div>
			</div>
			{/* {!products[id] && <p>loading...</p>} */}
			<ClearButton
				onClick={onDelete}
				className={s.selectedProduct__deleteButton}
			/>
		</li>
	);
};

export default SelectedProductsItem;
