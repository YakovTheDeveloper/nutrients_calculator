import React, { useEffect } from 'react';
import Form from '@forms/Form';
import Input from '@ui/Input/Input';
import styles from './index.module.scss';
import { useUserStore } from '@data/user';
import { useProductStore } from '@data/products';
import { initNutrients } from '@constants/nutrients';
import { groupNutrientsByCategory } from '@helpers/mappers';
import { isEmpty } from '@helpers/isEmpty';
import { createProductIdToQuantityMapping } from '@helpers/createProductIdToQuantityMapping';
import { fetchAddUserMenu } from '@api/methods';
import ClearButton from '@ui/Button/ClearButton';
import { useForm } from 'react-hook-form';
import { Button } from '@ui/Button';
import { useModalStore } from '@data/modal';
import { useMenuProducts } from '@pages/menu/SingleMenu/useMenuProducts';
import { stat } from 'fs';

const AddMenuForm = ({ cornerButton }: any) => {
    const { addMenu } = useUserStore();
    // const selectedProducts = useProductStore((state) => state);
    const selectedProducts = useUserStore(s => s.mainPageMenu.products);
    const togglePopover= useModalStore(s => s.togglePopover);

    async function addMenuHandler({ name, description }: Form.AddMenuForm) {
        // console.log('products',products);
        if (isEmpty(selectedProducts)) {
            return Promise.reject('No Products.ItemSelected');
        }
        const response = await fetchAddUserMenu({
            name,
            description,
            ids: selectedProducts,
        });
        addMenu({
            id: response.result.menuId,
            name,
            description: description,
            products: selectedProducts,
        });
        togglePopover(false);
    }

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    // useEffect(() => {
    //     clearAllErrors();
    // }, [selectedProducts]);
    console.log('errors',errors);

    return (
        <form onSubmit={handleSubmit((data: Form.AddMenuForm) => addMenuHandler(data))}>
            <Input
                {...register('name', { required: true })}
                placeholder='Dinner menu...'
                label="Name"
                type="name"
                required
                size="medium"
                aria-label="name-input"
                onClear={() => {
                    setValue('name', '');
                }}
            />
            {errors.name && <p> is required.</p>}

            <Input
                {...register('description', { required: true, minLength: 5 })}
                placeholder='Not much calories...'
                label="Description"
                type="text"
                required
                size="medium"
                aria-label="description-input"
                onClear={() => {
                    setValue('description', '');
                }}
                error={{
                    itself:errors.description,
                    message:'Last name is required.'
                }}
            />

            <Button type='submit'>
                Okay
            </Button>
        </form>
    );
};

export default AddMenuForm;
