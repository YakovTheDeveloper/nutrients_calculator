import { useUserStore } from '@data/user'
import { useEffect } from 'react'
import { debounce } from '@helpers/debounce'
import { useState } from 'react'
import { AnyObject, Maybe, ObjectSchema, ValidationError } from 'yup'
import { formSchemas, initialFormValues } from './data'

const RESPONSE_ERROR_KEY = 'responseError'

const useForm = <Form>(
    form: Form.Names,
    submitCallback: (payload: Form) => Promise<Api.Result>,
    init: Form
) => {
    const [formData, setFormData] = useState(init)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [showErrors, setShowErrors] = useState(false)
    const [success, setSuccess] = useState(false)

    // console.log('formData', formData)

    const clearAllErrors = () => setErrors({})

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShowErrors(false)
        setSuccess(false)
        const field = e.target.name
        setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    }

    // const showErrorsDelayed = debounce(() => setShowErrors(true), 2000)
    // const setErrorsDelayed = debounce(setErrors, 1000)

    const validateField = (e: React.FocusEvent<HTMLInputElement, Element>) => {
        const inputName = e.target.name
        const inputValue = e.target.value
        try {
            if (!inputValue) return // prevent validation on untouched fields
            const currentSchema = formSchemas[form]
            const inputValidated = currentSchema.validateSyncAt(inputName, {
                [inputName]: inputValue,
            })
            if (inputValidated)
                setErrors((prev) => ({ ...prev, [inputName]: '' }))
        } catch (err) {
            setShowErrors(true)
            const validationError = err as ValidationError
            setErrors((prev) => ({
                ...prev,
                [inputName]: validationError.message,
            }))
        }
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const atLeastOneValidationError = Object.entries(errors).some(
            ([key, value]) => value !== '' && key !== RESPONSE_ERROR_KEY
        )

        if (atLeastOneValidationError) return

        try {
            await submitCallback(formData)
            setFormData(init)
            setSuccess(true)
        } catch (error) {
            setShowErrors(true)
            setErrors((prev) => ({
                ...prev,
                [RESPONSE_ERROR_KEY]: error as string,
            }))
            return
        }

        // if (response.hasError) {
        //     console.log('ERROR', response)
        //     setShowErrors(true)
        //     setErrors((prev) => ({
        //         ...prev,
        //         [RESPONSE_ERROR_KEY]: response.detail,
        //     }))
        //     return
        // }
    }

    useEffect(() => {
        let timeout: NodeJS.Timeout
        if (success) timeout = setTimeout(() => setSuccess(false), 2500)
        return () => clearTimeout(timeout)
    }, [success])

    return {
        onChange,
        validateField,
        errors,
        success,
        formData,
        onSubmit,
        showErrors,
        clearAllErrors,
    }
}

export default useForm
