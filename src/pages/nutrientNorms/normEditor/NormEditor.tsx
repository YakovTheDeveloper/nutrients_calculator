import React, { useEffect, useMemo } from 'react';
import { useImmer } from 'use-immer';

import { fetchAddNorm, fetchDeleteNorm, fetchPatchNorm } from '@api/methods';
import { DefaultNormsId, nutrientCodeToName } from '@constants/nutrients';
import { useNutrientNormsStore } from '@data/normsStore';
import { useSettings } from '@data/settings';
import { objectEntries } from '@helpers/objectEntries';
import { Button, ButtonTypes } from '@ui/Button';
import Input from '@ui/Input/Input';
import Table from '@ui/Nutrients2/Table';

import s from './NormEditor.module.scss';

const normToArray = (item: Norm.Item) => {
	console.log('item', item);

	if (!item) {
		return [];
	}

	return objectEntries(item.norm).map(([id, value]) => ({
		id,
		value,
	}));
};

const columns = [
	{ key: 'name', label: 'Name' },
	{ key: 'value', label: 'Quantity' },
];

const DEFAULT_NORMS_IDS = [DefaultNormsId.Standard, DefaultNormsId.Sport];

const NormEditor = () => {
	const { currentNormId } = useSettings((state) => state.calcSettings);
	const setCalcNutrientNormId = useSettings((state) => state.setCalcNutrientNormId);
	// const addNutrientNorm = useNutrientNormsStore((state) => state.addNutrientNorm);
	const nutrientNorms = useNutrientNormsStore((state) => state.nutrientNorms);
	const deleteNutrientNorm = useNutrientNormsStore((state) => state.deleteNutrientNorm);
	const patchNutrientNorm = useNutrientNormsStore((state) => state.patchNutrientNorm);
	const patchNutrientNormId = useNutrientNormsStore((state) => state.patchNutrientNormId);
	const currentNorm = nutrientNorms.find((norm) => norm.id === currentNormId);

	const [newDraftNorm, setNewDraftNorm] = useImmer<Norm.Item>(JSON.parse(JSON.stringify(currentNorm)));

	const wasChange = useMemo(
		() => currentNorm?.id === newDraftNorm.id && JSON.stringify(currentNorm) !== JSON.stringify(newDraftNorm),
		[currentNorm, newDraftNorm],
	);
	//  || currentNorm?.name !== newDraftNorm.name

	useEffect(() => {
		const currentNorm = nutrientNorms.find((norm) => norm.id === currentNormId);
		setNewDraftNorm(currentNorm);
	}, [currentNormId, nutrientNorms]);

	const clearNutrientNormEditor = () => currentNorm && setNewDraftNorm(currentNorm);

	const changeNutrientNormEditorValue = (id: string, value: number) =>
		setNewDraftNorm((draft) => {
			draft.norm[id] = value;
		});

	const addNormHandler = async () => {
		patchNutrientNorm({
			...newDraftNorm,
			isDraft: false,
		});

		try {
			const { isDraft, id, ...norm } = newDraftNorm;

			const data = await fetchAddNorm(norm);

			console.log('OMG', data);

			setCalcNutrientNormId(data.result.id);

			patchNutrientNormId(id, data.result.id);

			if (data.result) {
				return;
			}
		} catch (e) {
			return;
		}
	};

	const patchNormHandler = async () => {
		patchNutrientNorm(newDraftNorm);

		try {
			await fetchPatchNorm(newDraftNorm);
		} catch (error) {
			return;
		}
	};

	const deleteNormHandler = async () => {
		!newDraftNorm.isDraft && fetchDeleteNorm(newDraftNorm.id);
		setCalcNutrientNormId('-1000');
		deleteNutrientNorm(currentNormId);
	};

	const isInputDisabled = () => DEFAULT_NORMS_IDS.includes(currentNormId);

	if (!currentNorm) {
		return null;
	}

	const newNormArray = normToArray(currentNorm);

	const InputOrText = (data: unknown) => {
		return isInputDisabled() ? (
			<p>{currentNorm?.norm[data.id] || 0}</p>
		) : (
			<Input
				disabled={isInputDisabled()}
				type='number'
				value={newDraftNorm?.norm[data.id] || 0}
				onChange={({ target: { value } }) => {
					changeNutrientNormEditorValue(data.id, Number(value));
				}}
			/>
		);
	};

	// if (currentNormId)
	return (
		<div className={s.normsEditor}>
			{/* <code>
                <pre>{JSON.stringify(currentNorm)}</pre>
                <pre>{JSON.stringify(newDraftNorm)}</pre>
            </code> */}
			{!DEFAULT_NORMS_IDS.includes(currentNormId) && (
				<div className={s.normsEditor__groupActions}>
					<Input
						label='Menu name:'
						className={s.normsEditor__groupActionsNameInput}
						value={newDraftNorm.name}
						onChange={({ target }) =>
							// setNormNameDraft(target.value)
							setNewDraftNorm((draft) => {
								draft.name = target.value;
							})
						}
					/>

					<Button onClick={clearNutrientNormEditor} variant={ButtonTypes.secondary}>
						Reset to original variant
					</Button>

					{wasChange && (
						<Button onClick={!newDraftNorm.isDraft ? patchNormHandler : addNormHandler}>
							{!newDraftNorm.isDraft ? 'Update norm' : 'Save new norm'}
						</Button>
					)}

					{!DEFAULT_NORMS_IDS.includes(currentNormId) && (
						<Button onClick={deleteNormHandler} variant={ButtonTypes.ghost}>
							Delete
						</Button>
					)}
				</div>
			)}
			<div className={s.normsEditor__group}>
				<Table
					data={newDraftNorm ? newNormArray.slice(0, newNormArray.length / 2) : []}
					columns={columns}
					render={{
						name: (data) => nutrientCodeToName[data.id],
						value: InputOrText,
					}}
				/>
				<Table
					data={newDraftNorm ? newNormArray.slice(newNormArray.length / 2, newNormArray.length) : []}
					columns={columns}
					render={{
						name: (data) => nutrientCodeToName[data.id],
						value: InputOrText,
					}}
				/>
			</div>
		</div>
	);
};

export default NormEditor;
