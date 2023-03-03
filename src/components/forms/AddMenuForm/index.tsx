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
                clear={() => {
                    return
                }}
                className={styles.loginInput}
            />
            <Input
                label="Description"
                name={inputNames.description}
                type="text"
                required
                onChange={onChange}
                onBlur={validateField}
                value={formData.description || ''}
                clear={() => {
                    return
                }}
                className={styles.loginInput}
            />
        </Form>
    )
}

export default AddMenuForm
