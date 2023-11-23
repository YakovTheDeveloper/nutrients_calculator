import React from 'react';
import {
    NutrientCodes,
    nutrientCodeToName,
    nutrientDailyNormCode,
} from '@constants/nutrients';
import s from './NormEditor.module.scss';
import Input from '@ui/Input/Input';
import { useSettings } from '@data/settings';
import classNames from 'classnames';
import { useImmer } from 'use-immer';
import { Button, ButtonTypes } from '@ui/Button';
import { useNutrientsStore } from '@data/nutrients';
import { Tab } from '@ui';
import { objectEntries } from '@helpers/objectEntries';
import Table from '@ui/Nutrients2/Table';
import { fetchAddNorm } from '@api/methods';

const createNewNorm = () => {
    const norm: Norm.Item = JSON.parse(JSON.stringify(nutrientDailyNormCode));
    norm.name = 'Name ' + Math.random().toString();
    return norm;
};

const normToArray = (item: Norm.Item) => {
    console.log('item', item);
    return objectEntries(item.norm).map(([id, value]) => ({
        id,
        value,
    }));
};

const columns = [
    { key: 'name', label: 'Name' },
    { key: 'value', label: 'Quantity' },
];

const DEFAULT_NORMS_IDS = ['-1000', '-1001'];

const NormEditor = () => {
    const { currentNormId } = useSettings((state) => state.calcSettings);
    const setCalcNutrientNormId = useSettings(
        (state) => state.setCalcNutrientNormId
    );
    const addNutrientNorm = useNutrientsStore((state) => state.addNutrientNorm);
    const nutrientNorms = useNutrientsStore((state) => state.nutrientNorms);

    const currentNorm = nutrientNorms.find((norm) => norm.id === currentNormId);

    const [newDraftNorm, setNewDraftNorm] = useImmer<Norm.Item>(currentNorm);

    // const onNewNutrientNormChange = (
    //     value: string,
    //     nutrientId: NutrientCodes
    // ) => {
    //     if (!newDraftNorm) return;
    //     setNewDraftNorm((prev) => {
    //         if (!prev) return;
    //         prev.norm[nutrientId] = +value;
    //     });
    // };

    const clearNutrientNormEditor = () =>
        setNewDraftNorm((draft) => (draft = createNewNorm()));

    const changeNutrientNormEditorValue = (id: string, value: number) =>
        setNewDraftNorm((draft) => {
            draft.norm[id] = value;
        });

    const addNormHandler = async () => {
        const { id, name } = newDraftNorm;
        try {
            // const data = await fetchAddNorm(newDraftNorm);
            // add notification
            if (data.result) return;
        } catch (e) {}
    };

    const onSaveNewNorm = () => {
        if (!newDraftNorm) return;
        // fetch add new norm

        //if ok
        addNutrientNorm(newDraftNorm);
        setNewDraftNorm(null);
    };

    const newNormArray = normToArray(newDraftNorm);

    const isInputDisabled = () => DEFAULT_NORMS_IDS.includes(currentNormId);

    if (!currentNorm) return null;

    const newNormArray2 = normToArray(currentNorm);

    const InputOrText = (data: unknown) => {
        return isInputDisabled() ? (
            <p>{currentNorm?.norm[data.id] || 0}</p>
        ) : (
            <Input
                disabled={isInputDisabled()}
                type="number"
                value={newDraftNorm?.norm[data.id] || 0}
                onChange={({ target: { value } }) =>
                    changeNutrientNormEditorValue(data.id, Number(value))
                }
            />
        );
    };

    // if (currentNormId)
    return (
        <div className={s.settings}>
            <Table
                heading={
                    <div className={s.norms__actions}>
                        <Button
                            onClick={clearNutrientNormEditor}
                            variant={ButtonTypes.secondary}
                        >
                            Reset to default
                        </Button>
                        <Button onClick={addNormHandler}>Add norm</Button>
                    </div>
                }
                data={
                    newDraftNorm
                        ? newNormArray2.slice(0, newNormArray2.length / 2)
                        : []
                }
                columns={columns}
                render={{
                    name: (data) => nutrientCodeToName[data.id],
                    value: InputOrText,
                }}
            />
            <Table
                data={
                    newDraftNorm
                        ? newNormArray2.slice(
                            newNormArray2.length / 2,
                            newNormArray2.length
                        )
                        : []
                }
                columns={columns}
                render={{
                    name: (data) => nutrientCodeToName[data.id],
                    value: InputOrText,
                }}
            />
        </div>
    );
};

export default NormEditor;
