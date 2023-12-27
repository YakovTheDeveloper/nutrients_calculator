import { ArrowIcon, EyeIconCross, EyeIcon } from '@assets/icons';
import { useSettings } from '@data/settings';
import { Tab, TabTypes } from '@ui/Tab';
import React from 'react';
import s from './NutrientsNavigation.module.scss';
import { NavLink } from 'react-router-dom';
import { useNutrientsStore } from '@data/nutrients';
import { useNutrientNormsStore } from '@data/normsStore';

type Props = {
    groups: Nutrients.Groups<Nutrients.GroupData>;
    navigate: (index: number) => void;
};

const NutrientsNavigation = ({ groups, navigate }: Props) => {
    const nutrientsSettings = useSettings((state) => state.nutrientsSettings),
        toggleNutrientsSettings = useSettings(
            (state) => state.toggleNutrientsSettings
        ),
        { currentNormId } = useSettings((state) => state.calcSettings),
        nutrientNorms = useNutrientNormsStore((state) => state.nutrientNorms),
        currentNorm = nutrientNorms.find((norm) => norm.id === currentNormId);

    return (
        <div className={s.nutrientsNavigation}>
            <button
                className={s.nutrientsNavigationToggleButton}
                onClick={() => toggleNutrientsSettings('showNav')}
            >
                {nutrientsSettings.showNav ? (
                    <ArrowIcon />
                ) : (
                    <ArrowIcon style={{ transform: 'rotate(180deg)' }} />
                )}
            </button>
            {nutrientsSettings.showNav && (
                <Tab.Panel>
                    {Object.values(groups).map((group, index) => (
                        <Tab
                            key={group.name}
                            variant={TabTypes.primary}
                            onClick={() => navigate(index)}
                            className={s.nutrientsNavigationTabsButton}
                        >
                            {group.label}
                        </Tab>
                    ))}
                    <p className={s.nutrientsNavigationNutrientNormInfo}>
                        Current norm:
                        <NavLink to={'/norms'}>{currentNorm?.name}</NavLink>
                    </p>
                    <button
                        className={s.nutrientsNavigationVisibilityButton}
                        onClick={() => toggleNutrientsSettings('showHidden')}
                    >
                        {nutrientsSettings.showHidden ? (
                            <EyeIconCross />
                        ) : (
                            <EyeIcon />
                        )}
                    </button>
                </Tab.Panel>
            )}
        </div>
    );
};

export default NutrientsNavigation;
