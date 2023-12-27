import React from 'react';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { v4 as uuidv4 } from 'uuid';

import { fetchGetNorms } from '@api/methods';
import { nutrientDailyNormCode } from '@constants/nutrients';
import { useNutrientNormsStore } from '@data/normsStore';
import { useSettings } from '@data/settings';
import { Tab, TabTypes } from '@ui';
import { Button, ButtonTypes } from '@ui/Button';
import { Loader } from '@ui/Loader';

import s from './NutrientNorms.module.scss';
import NormEditor from './normEditor/NormEditor';

const createNewNorm = () => {
	const norm: Norm.ItemInNormEditor = JSON.parse(JSON.stringify(nutrientDailyNormCode));
	norm.name = 'New norm';
	norm.id = uuidv4();
	norm.isDraft = true;

	return norm;
};

const NutrientNorms = () => {
	const { isLoading } = useSWR('/norms', fetchGetNorms);

	const nutrientNorms = useNutrientNormsStore((state) => state.nutrientNorms);
	const { currentNormId } = useSettings((state) => state.calcSettings);
	const setCalcNutrientNormId = useSettings((state) => state.setCalcNutrientNormId);
	const addNutrientNorm = useNutrientNormsStore((state) => state.addNutrientNorm);

	const createNewNormHandler = () => {
		const norm = createNewNorm();
		addNutrientNorm(norm);
		setCalcNutrientNormId(norm.id);
	};

	const BackButton = () => {
		const navigate = useNavigate();

		return (
			<>
				<Button variant={ButtonTypes.ghost} onClick={() => navigate(-1)}>
					{'<-- '}Back
				</Button>
			</>
		);
	};

	return (
		<div className={s.norms}>
			{/* {currentNormId} */}
			<div className={s.norms__actions}>
				<BackButton />
				<div className={s.norms__actionsGroup}>
					<Tab.Panel>
						{nutrientNorms.map(({ id, name }) => (
							<Tab key={id} active={currentNormId === id} onClick={() => setCalcNutrientNormId(id)}>
								{name}
							</Tab>
						))}
						{isLoading && <Loader />}
					</Tab.Panel>
				</div>
				<div className={s.norms__actionsGroup}>
					<Tab.Panel>
						<Tab variant={TabTypes.secondary} onClick={createNewNormHandler}>
							+ New Norm
						</Tab>
					</Tab.Panel>
				</div>
			</div>

			<NormEditor />
		</div>
	);
};

export default NutrientNorms;
