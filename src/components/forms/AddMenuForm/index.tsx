import React, { useEffect } from 'react'
import { createDefaultResult, post } from '@api'
import Form from '@forms/Form'
import useForm from '@hooks/useForm'
import Input from '@ui/Input/Input'
import styles from './index.module.scss'
import { useUserStore } from '@data/user'
import { useProductStore } from '@data/products'
import { initNutrients } from '@constants/nutrients'
import { getNutrientTablesByCategory } from '@helpers/mappers'
import { isEmpty } from '@helpers/isEmpty'
const inputNames: Form.InputNames<Form.AddMenuForm> = {
    name: 'name',
    description: 'description',
}

const init: Form.AddMenuForm = {
    name: '',
    description: '',
}

const createIdToQuantityParamsQueryList = (products: Data.SelectedProducts) => {
    return Object.entries(products).reduce(
        (acc: string[], [id, { quantity }]) => {
            acc.push(`id${id}=${quantity}`)
            return acc
        },
        []
    )
}

const AddMenuForm = ({ cornerButton }: any) => {
    const { addMenu } = useUserStore()
    const selectedProducts = useProductStore((state) => state.selectedProducts)

    const totalNutrients = useProductStore((state) => state.totalNutrients)

    async function addMenuHandler({
        name,
        description,
    }: Form.AddMenuForm): Promise<Api.Result> {
        if (isEmpty(selectedProducts)) {
            const result = createDefaultResult()
            result.detail = 'No products selected'
            return result
        }
        const params = [
            ...createIdToQuantityParamsQueryList(selectedProducts),
            `name=${name}`,
            `description=${description}`,
        ].join('&')

        const result = await post(`products/menu/?${params}`)
        if (result.hasError === false) {
            console.log('result', result)
            addMenu({
                id: result.result.menuId,
                name,
                description: description,
                products: selectedProducts,
                nutrients: totalNutrients,
                // nutrients: getNutrientTablesByCategory(initNutrients),
                //todo add nutrients to store
            })
        }
        return result
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
