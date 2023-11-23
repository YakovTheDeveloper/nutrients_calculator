import Footer from "@layout/Footer";
import Header from "@layout/Header";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { NutrientCodes, nutrientCodeToName, nutrientDailyNormCode, NutrientsNorm } from "@constants/nutrients";
import s from "./Settings.module.scss";
import Input from "@ui/Input/Input";
import { useSettings } from "@data/settings";
import classNames from "classnames";
import { useImmer } from "use-immer";
import {Button} from "@ui/Button";
import { useNutrientsStore } from "@data/nutrients";
import { Tab } from "@ui";
import { objectEntries } from "@helpers/objectEntries";



const createNewNorm = () => {
    const norm = JSON.parse(JSON.stringify(nutrientDailyNormCode));
    norm.id = Math.random().toString();
    norm.name = "Name " + Math.random().toString();
    return norm;
};

const NutrientNorms = () => {

    const { currentNormId } = useSettings(state => state.calcSettings);
    const setCalcNutrientNorm = useSettings(state => state.setCalcNutrientNorm);
    const addNutrientNorm = useNutrientsStore(state => state.addNutrientNorm);
    const nutrientNorms = useNutrientsStore(state => state.nutrientNorms);
    const [newNorm, setNewNorm] = useImmer<NutrientsNorm | null>(null);

    const forExampleNorm = JSON.parse(JSON.stringify(nutrientDailyNormCode));
    forExampleNorm.id = "1";
    forExampleNorm.name = "Custom";

    const onNewNutrientNormChange = (value: string, nutrientId: NutrientCodes) => {
        if (!newNorm) return;
        setNewNorm(prev => {
            if (!prev) return;
            prev.nameToQuantityMapping[nutrientId] = +value;
        });
    };

    const onSaveNewNorm = () => {
        if (!newNorm) return;
        // fetch add new norm

        //if ok
        addNutrientNorm(newNorm);
        setNewNorm(null);
    };

    return (
        <div className={s.settings}>
            <Tab.Panel>
                {nutrientNorms.map(({ id, name }) => (
                    <Tab active={currentNormId === id} onClick={() => setCalcNutrientNorm(id)}>{name}</Tab>
                ))}

            </Tab.Panel>
            Установить норму нутриентов
            <button onClick={() => {
                setNewNorm(createNewNorm());
            }}>add</button>
            <div className={s.norms}>
                {newNorm &&
                  <div className={classNames(s.normsNorm)}>
                    <div className={classNames(s.normsNorm__table)}>
                        {objectEntries(newNorm.nameToQuantityMapping).map(([code, value]) => {
                            return (
                                <>
                                    <span>{nutrientCodeToName[code]}</span>
                                    <Input value={newNorm.nameToQuantityMapping[code]}
                                           onChange={(e) => onNewNutrientNormChange(e.target.value, code)} />
                                </>);
                        })}
                    </div>
                    <Button onClick={onSaveNewNorm}>
                      Сохранить
                    </Button>
                  </div>}
                {nutrientNorms.map(({ id, nameToQuantityMapping, name }) =>
                    <div className={classNames(s.normsNorm, currentNormId === id && s.normsNorm_selected)}>
                        <div className={classNames(s.normsNorm__table)}>
                            {objectEntries(nameToQuantityMapping).map(([code, value]) => {
                                return <>
                                    <span>{nutrientCodeToName[code]}</span>
                                    {id !== "0" ? <Input value={value} /> : <span>{value}</span>}

                                </>;
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NutrientNorms;
