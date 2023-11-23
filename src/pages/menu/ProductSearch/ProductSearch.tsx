import { fetchProductList } from '@api/methods';
import { productIdToNameAndDescriptionMapping } from '@constants/products';
import { useKeyPressed, useKeyPressed2 } from '@hooks/useKeyPress';
import ClearButton from '@ui/Button/ClearButton';
import Input from '@ui/Input/Input';
import ListItem from '@ui/Search/ListItem';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './ProductSearch.module.scss';
import cn from 'classnames';
import { ProductSearchListItem } from './ProductSearchListItem';
import { useBaseProducts } from '@data/product/useBaseProducts';

type ProductSearchProps = {
  onProductAdd: (productId: number) => void;
  selectedProducts: Products.Selected2;
};
const ProductSearch = ({
	onProductAdd,
	selectedProducts,
}: ProductSearchProps) => {
	const [searchText, setSearchText] = useState('');

	const [showList, setShowList] = useState(false);

	const getMixedProductsMinimal = useBaseProducts(s => s.getMixedProductsMinimal);

	const productList = useRef<HTMLUListElement>(null);

	useEffect(() => {
		const handler = (e) => {
			const target = e.target as HTMLElement;
			if (!productList.current?.contains(target)) setShowList(false);
			// if (!target?.contains(productList.current)) setShowList(false)
		};
		document.addEventListener('click', handler);
		return () => {
			document.removeEventListener('click', handler);
		};
	}, [productList, setShowList, showList]);

	const keyMapping = useMemo(
		() => ({
			Escape: () => {
				setShowList(false);
				setSearchText('');
			},
		}),
		[]
	);

	useKeyPressed2(keyMapping);

	// useEffect(() => {
	//     setShowList(true)
	// }, [searchText])

	const handleClearClick = () => {
		setSearchText('');
		setShowList(false);
	};

	const filteredList = Object.entries(
		getMixedProductsMinimal()
	).filter(([_, data]) =>
		data.name.toLowerCase().includes(searchText.toLowerCase())
	);

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchText(e.target.value);
		setShowList(true);
	};

	console.log('wtf', filteredList);

	const noContentFound = filteredList.length === 0;

	return (
		<div className={styles.container}>
			<div className={styles.inputContainer}>
				<Input
					type="text"
					placeholder="Pasta..."
					value={searchText}
					onChange={onChange}
					onKeyDown={(e) => {
						if (e.code === 'Tab') {
							productList.current?.focus();
							console.log(productList.current);
						}
					}}
					size="big"
					pattern="[A-Za-z]+"
					onClear={handleClearClick}
				/>
			</div>

			{showList && (
				<ul
					tabIndex={-1}
					className={cn(styles.list, noContentFound && styles.list_noResult)}
					ref={productList}
				>
					{filteredList.map(([productId, data], index) => (
						<ProductSearch.Item
							tabIndex={index + 1}
							onClick={() => onProductAdd(+productId)}
							key={productId}
							data={data}
							isChosen={selectedProducts[+productId] != null}
						/>
					))}
				</ul>
			)}
		</div>
	);
};

ProductSearch.Item = ProductSearchListItem;

export default ProductSearch;
