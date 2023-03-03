import React, { useEffect } from 'react'
import Form from '@forms/Form'
import useForm from '@hooks/useForm'
import Input from '@ui/Input/Input'
import styles from './index.module.scss'
import { useUserStore } from '@data/user'
import { useProductStore } from '@data/products'
import { initNutrients } from '@constants/nutrients'
import { getNutrientTablesByCategory } from '@helpers/mappers'
import { isEmpty } from '@helpers/isEmpty'
import { createProductIdToQuantityMapping } from '@helpers/createProductIdToQuantityMapping'
import { fetchAddUserMenu } from '@api/methods'
import ClearButton from '@ui/Button/ClearButton'
const inputNames: Form.InputNames<Form.AddMenuForm> = {
    name: 'name',
    description: 'description',
}

const init: Form.AddMenuForm = {
    name: '',
    description: '',
}

const AddMenuForm = ({ cornerButton }: any) => {
    const { addMenu } = useUserStore()
    const selectedProducts = useProductStore((state) => state.selectedProducts)

    const totalNutrients = useProductStore((state) => state.totalNutrients)

    async function addMenuHandler({ name, description }: Form.AddMenuForm) {
        if (isEmpty(selectedProducts)) {
            return Promise.reject('No Products.ItemSelected')
        }
        const response = await fetchAddUserMenu({
            name,
            description,
            ids: createProductIdToQuantityMapping(selectedProducts),
        })
        addMenu({
            id: response.result.menuId,
            name,
            description: description,
            products: selectedProducts,
            nutrients: totalNutrients,
        })
    }

    const {
        errors,
        formData,
        validateField,
        showErrors,
        onChange,
        onSubmit,
        success,
        clearAllErrors,
    } = useForm<Form.AddMenuForm>('addMenu', addMenuHandler, init)

    useEffect(() => {
        clearAllErrors()
    }, [selectedProducts])

    return (
        <Form
            errors={errors}
            onSubmit={onSubmit}
            showErrors={showErrors}
            success={success}
            className={styles.container}
        >
            {cornerButton}
            <Input
                label="Name"
                name={inputNames.name}
                type="text"
                required
                onChange={onChange}
                onBlur={validateField}
                value={formData.name}
                size="small"
                placeholder="name of your menu"
                // className={styles.loginInput}
            >
                {/* <ClearButton
                    show={formData.name !== '0'}
                    onClick={() => (formData.name = '')}
                    className={styles.container}
                /> */}
            </Input>
            <Input
                label="Description"
                name={inputNames.description}
                type="text"
                required
                onChange={onChange}
                onBlur={validateField}
                value={formData.description || ''}
                size="small"
                placeholder="description of your menu"

                // className={styles.loginInput}
            >
                {/* <ClearButton
                    show={formData.description !== '0'}
                    onClick={() => (formData.description = '')}
                    className={styles.container}
                /> */}
            </Input>
        </Form>
    )
}

export default AddMenuForm
