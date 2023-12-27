import classNames from 'classnames';
import React, { useEffect, useMemo } from 'react';
import useSWR from 'swr';

import { fetchNutrients } from '@api/methods';
import { getNutrientsByGroups, useNutrientsStore } from '@data/nutrients';
import { useProductTierStore } from '@data/productTierStore';
import { objectEntries } from '@helpers/objectEntries';
import { useNutrientNavigation } from '@pages/common/useNutrientNavigation';
import Table from '@ui/Nutrients2/Table';

import ProductNutrientContentContainer from './ProductNutrientContent';
import s from './index.module.scss';

const columns = [
	{
		key: 'name',
		label: 'Name',
	},
];

const ProductsTierPage = () => {
	const { allDefaultNutrientsFromNorm, setAllDefaultNutrientsFromNorm, hasDefaultNutrientsFromNorm } =
			useNutrientsStore(),
		{ scrollRefs, containerRef, navigate } = useNutrientNavigation(),
		{ data: result, isLoading } = useSWR('/nutrients', () => fetchNutrients({ have_norms: true })),
		currentNutrient = useProductTierStore((s) => s.currentNutrient),
		setCurrentNutrient = useProductTierStore((s) => s.setCurrentNutrient);

	useEffect(() => {
		if (hasDefaultNutrientsFromNorm()) {
			return;
		}

		if (result) {
			setAllDefaultNutrientsFromNorm(result.result);
		}
	}, [result]);

	// const [currentNutrient, setCurrentNutrient] =
	//     useState<{
	//         id: number,
	//         name: string
	//     } | null>(null);

	const groups = useMemo(() => getNutrientsByGroups(allDefaultNutrientsFromNorm), [allDefaultNutrientsFromNorm]);
	const render = {
		name: ({ id, name }) => (
			<div
				className={classNames(
					s.productTiers__nutrient,
					id === currentNutrient?.id && s.productTiers__nutrient_active,
				)}
				onClick={() =>
					setCurrentNutrient({
						id,
						name,
					})
				}
			>
				{name}
			</div>
		),
	};

	return (
		<div className={s.productTiers} ref={containerRef}>
			<div>
				{objectEntries(groups).map(([key, group], index) => {
					// if (!showGroups[key]) return null;
					return (
						<Table
							ref={scrollRefs[index]}
							key={key}
							data={group.content}
							heading={group.name}
							columns={columns}
							render={render}
							emptyPlaceholder={'N/A'}
							showHeader={false}
							highlight={{
								show: false,
							}}
						/>
					);
				})}
			</div>
			{currentNutrient && <ProductNutrientContentContainer nutrientId={currentNutrient?.id} />}
			{/* <ProductTierContent currentNutrient={currentNutrient} /> */}
		</div>
	);
};

export default ProductsTierPage;
