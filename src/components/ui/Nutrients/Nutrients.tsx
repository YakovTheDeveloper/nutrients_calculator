import React, { memo, useMemo, useRef } from 'react';
import styles from './Nutrients.module.scss';
import { getDailyNormPercent } from '@helpers/calculations/getDailyNormPercent';
import { nutrientDailyNormCode } from '@constants/nutrients';
import cn from 'classnames';
import { useSettings } from '@data/settings';
import {
    getHidenNutrients,
    getNutrientsByGroups,
    useNutrientsStore,
} from '@data/nutrients';
import { Tab, TabTypes } from '@ui';
import { ArrowIcon, EyeIcon, EyeIconCross } from '@assets/icons';
import Table from '@ui/Nutrients2/Table';
import { objectEntries } from '@helpers/objectEntries';
import { useNutrientNavigation } from '@pages/common/useNutrientNavigation';
import { NormPercentBar } from './NormPercentBar';
import { NutrientsNavigation } from './NutrientsNavigation';
import { useNutrientNormsStore } from '@data/normsStore';

const columns = [
    { key: 'name', label: 'Name' },
    { key: 'percent', label: '%' },
    { key: 'amount', label: 'Value' },
    { key: 'unit', label: 'Unit' },
    { key: 'action', label: '' },
];

type NutrientsProps = {
    data: Nutrients.Item[];
};

const Nutrients = ({ data }: NutrientsProps) => {
    // const containerRef = useRef<HTMLDivElement | null>(null),
    const nutrientsSettings = useSettings((state) => state.nutrientsSettings),
        nutrientVisibilityMapping = useNutrientsStore(
            (state) => state.nutrientVisibilityMapping
        ),
        currentNormId = useSettings(
            (state) => state.calcSettings.currentNormId
        ),
        nutrientNorms = useNutrientNormsStore((state) => state.nutrientNorms),
        toggleNutrientVisibility = useNutrientsStore(
            (state) => state.toggleNutrientVisibility
        ),
        isNutrientHidden = useNutrientsStore((state) => state.isNutrientHidden),
        currentNorm = nutrientNorms.find((norm) => norm.id === currentNormId),
        groups = getNutrientsByGroups(data),
        { scrollRefs, containerRef, navigate } = useNutrientNavigation(),
        emptyGroups = Object.values(groups).every(
            (group) => group.content.length === 0
        ),
        render: RenderObject<Nutrients.Item> = useMemo(
            () => ({
                percent: (item: Nutrients.Item) => {
                    const percent = getDailyNormPercent(
                        item.code,
                        item.amount,
                        currentNorm
                    );
                    return (
                        <span className={styles.nutrients__percent}>
                            {nutrientDailyNormCode.norm[item.code] && (
                                <>
                                    <span
                                        className={
                                            styles.listItemPercent__value
                                        }
                                    >
                                        {percent}
                                    </span>
                                    <NormPercentBar item={item} />
                                </>
                            )}
                        </span>
                    );
                },
                unit: (item: Nutrients.Item) => {
                    return <span>{item.unit}</span>;
                },
                action: (item: Nutrients.Item) => {
                    return (
                        <button
                            className={cn(
                                styles.nutrients__visibilityButton,
                                styles.nutrients__visibilityButton_row
                            )}
                            onClick={() => toggleNutrientVisibility(item.id)}
                        >
                            {isNutrientHidden(item.id) ? (
                                <EyeIcon fill="red" color="red" />
                            ) : (
                                <EyeIconCross fill="red" color="red" />
                            )}
                        </button>
                    );
                },
            }),
            [currentNorm]
        );
    console.log('FUCK',nutrientNorms);

    if (emptyGroups) return null;

    return (
        <div>
            {<NutrientsNavigation groups={groups} navigate={navigate} />}
            <div className={styles.nutrients__tables} ref={containerRef}>
                {objectEntries(groups).map(([key, group], index) => {
                    console.log(
                        '@@@',
                        nutrientVisibilityMapping,
                        group.content
                    );
                    const groupContent = nutrientsSettings.showHidden
                        ? group.content
                        : group.content.filter(
                            (item) => !isNutrientHidden(item.id)
                        );
                    return (
                        <Table
                            style={{
                                gridTemplateColumns: '15fr 5fr 5fr 5fr 1fr',
                            }}
                            ref={scrollRefs[index]}
                            key={key}
                            data={groupContent}
                            heading={group.name}
                            columns={columns}
                            render={render}
                            emptyPlaceholder={'N/A'}
                            hide={{
                                ids: getHidenNutrients(
                                    nutrientVisibilityMapping
                                ),
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default memo(Nutrients);
