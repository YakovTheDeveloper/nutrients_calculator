import React, { useState } from 'react';
import {
    NutrientCodes,
    nutrientCodeToName,
    nutrientDailyNormCode,
} from '@constants/nutrients';
import s from './NutrientNorms.module.scss';
import Input from '@ui/Input/Input';
import { useSettings } from '@data/settings';
import classNames from 'classnames';
import { useImmer } from 'use-immer';
import { Button, ButtonTypes } from '@ui/Button';
import { useNutrientsStore } from '@data/nutrients';
import { Tab, TabTypes } from '@ui';
import { objectEntries } from '@helpers/objectEntries';
import Table from '@ui/Nutrients2/Table';
import NormEditor from './normEditor/NormEditor';
import { v4 as uuidv4 } from 'uuid';

const createNewNorm = () => {
    const norm: Norm.Item = JSON.parse(JSON.stringify(nutrientDailyNormCode));
    norm.name = 'My Norm';
    norm.id = uuidv4();
    return norm;
};

const NutrientNorms = () => {
    const [tab, setTab] = useState();

    const nutrientNorms = useNutrientsStore((state) => state.nutrientNorms);
    const { currentNormId } = useSettings((state) => state.calcSettings);
    const setCalcNutrientNormId = useSettings(
        (state) => state.setCalcNutrientNormId
    );
    const addNutrientNorm = useNutrientsStore((state) => state.addNutrientNorm);

    const createNewNormHandler = () => {
        const norm = createNewNorm();
        addNutrientNorm(norm);
        setCalcNutrientNormId(norm.id);
    };

    return (
        <div className={s.settings}>
            {currentNormId}
            <div className={s.settings__norms}>
                <div className={s.settings__normsGroup}>
                    <Tab.Panel>
                        {nutrientNorms.map(({ id, name }) => (
                            <Tab
                                key={id}
                                active={currentNormId === id}
                                onClick={() => setCalcNutrientNormId(id)}
                            >
                                {name}
                            </Tab>
                        ))}
                    </Tab.Panel>
                </div>
                <div className={s.settings__normsGroup}>
                    <Tab.Panel>
                        <Tab
                            variant={TabTypes.secondary}
                            onClick={createNewNormHandler}
                        >
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
