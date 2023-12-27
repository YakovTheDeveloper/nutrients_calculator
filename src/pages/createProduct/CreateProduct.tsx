import React, { useEffect, useMemo, useState } from 'react';
import { fetchCreateProduct, fetchNutrients } from '@api/methods';
import Table from '@ui/Nutrients2/Table';
import Input from '@ui/Input/Input';
import { getNutrientsByGroups, NutrientsState, useNutrientsStore } from '@data/nutrients';
import { objectEntries } from '@helpers/objectEntries';
import s from './CreateProduct.module.scss';
import NutrientNavigation from '../common/NutrientNavigation';
import { useNutrientNavigation } from '@pages/common/useNutrientNavigation';
import { Button, ButtonTypes } from '@ui/Button';
import { useUserStore } from '@data/user';
import { useCreateProductStore } from '@data/product/createProduct';
import Nutrients from '@ui/Nutrients/Nutrients';
import { useImmer } from 'use-immer';
import { useBaseProducts } from '@data/product/useBaseProducts';
import { useProductStore } from '@data/products';
import { fileFrom } from 'node-fetch';

const columns = [{
    key: 'name',
    label: 'Name'
}, {
    key: 'amount',
    label: 'Value'
}, {
    key: 'unit_name',
    label: 'Unit'
}];

export const CreateProduct = () => {
    const { allDefaultNutrients, setAllDefaultNutrients, hasDefaultNutrients } = useNutrientsStore(),
        nutrientsToAmountMapping = useCreateProductStore(s => s.nutrientsToAmountMapping),
        { name, description } = useCreateProductStore(s => s.description),

        setNutrientsToAmountMapping = useCreateProductStore(s => s.setNutrientsToAmountMapping),
        setDescription = useCreateProductStore(s => s.setDescription),
        reset = useCreateProductStore(s => s.reset),
        toServerFormat = useCreateProductStore(s => s.toServerFormat),
        // addProduct = useProductStore(s => s.addProduct),

        { scrollRefs, containerRef, navigate } = useNutrientNavigation(),
        addToUserProductsMinimal = useBaseProducts(s => s.addToUserProductsMinimal),
        [showGroups, setShowGroups] = useImmer<Nutrients.Groups<boolean>>({
            primary: true,
            carbohydrate: true,
            mineral: true,
            vitamin_b: true,
            vitamin_rest: true,
            aminoacid: true,
            rest: false
        }),
        [loading, setLoading] = useImmer({
            product: false
        });
    const toggleShowGroup = (groupName: Nutrients.GroupNames) => setShowGroups(draft => draft[groupName] = !draft[groupName]);

    useEffect(() => {
        if (hasDefaultNutrients()) return;
        fetchNutrients()
            .then((data) => {

                if (!data.result) return;
                setAllDefaultNutrients(data.result);
            });
    }, []);

    const onAdd = async () => {
        // onAdd
        setLoading(draft => {
            draft.product = true;
        });
        const payload = toServerFormat();

        try {
            const { result } = await fetchCreateProduct(payload);
            if (result) {
                result.description = result.description.split(',');
                addToUserProductsMinimal(result);
                // addProduct({
                //     [result.id]: result
                // });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(draft => {
                draft.product = false;
            });
        }
    };


    const groups = useMemo(() => getNutrientsByGroups(allDefaultNutrients), [allDefaultNutrients]);

    const tabNames = Object.values(groups).map(({ label }) => label);
    console.log('tabNames',groups);

    // if (!hasDefaultNutrients()) return;

    type RenderObject<T extends {}> = {
        [key: string]: (data: T) => React.ReactNode
    }

    const render: RenderObject<Nutrients.Item> = useMemo(() => ({
        amount: (data) => <Input
            value={nutrientsToAmountMapping[data.id] || 0}
            onChange={({ target: { value } }) => setNutrientsToAmountMapping(data.id, +value)}
        />,
        unit_name: (data) => data.unit_name.toLowerCase()
    }), [nutrientsToAmountMapping]);

    return (
        <div className={s.createProduct}>
            <div className={s.createProduct__header}>
                <div className={s.createProduct__headerCol}>
                    <Input label={'Name'} value={name}
                        onChange={({ target: { value } }) => setDescription('name', value)} />
                    <Input
                        label={'Description'}
                        value={description}
                        onChange={({ target: { value } }) => setDescription('description', value)} />
                </div>
                <div className={s.createProduct__headerRow}>
                    <NutrientNavigation
                        show={true}
                        onTabClick={(i) => navigate(i)}
                        tabNames={tabNames}
                    />
                    <Button onClick={reset} variant={ButtonTypes.secondary}>
                        Reset
                    </Button>
                    <Button onClick={onAdd}>
                        Create product
                    </Button>
                </div>
            </div>
            <div className={s.createProduct__tables} ref={containerRef}>
                {objectEntries(groups).map(([key, group], index) => {
                    if (!showGroups[key]) return null;
                    return (
                        <Table
                            ref={scrollRefs[index]}
                            key={key}
                            data={group.content}
                            heading={group.name}
                            columns={columns}
                            render={render}
                            emptyPlaceholder={'N/A'}
                        />
                    );
                })}
            </div>
        </div>
    );
};
export default CreateProduct;