import React from "react";
import { NutrientCodes, nutrientCodeToName, nutrientDailyNormCode } from "@constants/nutrients";
import s from "./NutrientNorms.module.scss";
import Input from "@ui/Input/Input";
import { useSettings } from "@data/settings";
import classNames from "classnames";
import { useImmer } from "use-immer";
import { Button, ButtonTypes } from "@ui/Button";
import { useNutrientsStore } from "@data/nutrients";
import { Tab } from "@ui";
import { objectEntries } from "@helpers/objectEntries";
import Table from "@ui/Nutrients2/Table";
import { Norm } from "../../types";


const createNewNorm = () => {
    const norm = JSON.parse(JSON.stringify(nutrientDailyNormCode));
    norm.id = Math.random().toString();
    norm.name = "Name " + Math.random().toString();
    return norm;
};

const normToArray = (norm: Norm.Item) => {
    return objectEntries(norm.nameToQuantityMapping).map(([id, value]) => ({
        id,
        value
    }));
};

const NutrientNorms = () => {

    const { currentNormId } = useSettings(state => state.calcSettings);
    const setCalcNutrientNorm = useSettings(state => state.setCalcNutrientNorm);
    const addNutrientNorm = useNutrientsStore(state => state.addNutrientNorm);
    const nutrientNorms = useNutrientsStore(state => state.nutrientNorms);
    const [newNorm, setNewNorm] = useImmer<Norm.Item>(() => createNewNorm());

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

    const clearNutrientNormEditor = () => setNewNorm(draft => draft = createNewNorm());

    const changeNutrientNormEditorValue = (id: string, value: number) => setNewNorm(draft => {
        draft.nameToQuantityMapping[id] = value;
    });


    const onSaveNewNorm = () => {
        if (!newNorm) return;
        // fetch add new norm

        //if ok
        addNutrientNorm(newNorm);
        setNewNorm(null);
    };
    console.log("Object.values(newNorm?.nameToQuantityMapping)", Object.values(newNorm?.nameToQuantityMapping));
    return (
        <div className={s.settings}>
            <Tab.Panel>
                {nutrientNorms.map(({ id, name }) => (
                    <Tab active={currentNormId === id} onClick={() => setCalcNutrientNorm(id)}>{name}</Tab>
                ))}

            </Tab.Panel>

            New daily norm editor


            <Table
                heading={(
                    <div className={s.norms__actions}>
                        <Button onClick={clearNutrientNormEditor} variant={ButtonTypes.secondary}>
                            Reset
                        </Button>
                        <Button
                            onClick={() => setNewNorm(createNewNorm())}
                        >
                            Add norm
                        </Button>
                    </div>
                )}
                data={newNorm ? normToArray(newNorm) : []}
                columns={[
                    { key: "name", label: "Name" },
                    { key: "value", label: "Quantity" }
                ]}
                render={{
                    name: (data) => nutrientCodeToName[data.id],
                    value: (data) => (
                        <Input
                            type="number"
                            value={newNorm?.nameToQuantityMapping[data.id] || 0}
                            onChange={({ target: { value } }) => changeNutrientNormEditorValue(data.id, Number(value))}
                        />
                    )
                }}
            >
            </Table>
        </div>
    );
};

export default NutrientNorms;
